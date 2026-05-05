import { createServerFn } from '@tanstack/react-start';
import { type StripeEnv, createStripeClient } from './stripe.server';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    priceId: string;
    customerEmail?: string;
    returnUrl: string;
    environment: StripeEnv;
    reportId?: string;
  }) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error('Invalid priceId');
    if (data.environment !== 'sandbox' && data.environment !== 'live') {
      throw new Error('Invalid environment');
    }
    return data;
  })
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);

    try {
      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) throw new Error('Price not found for lookup_key=' + data.priceId);
      const stripePrice = prices.data[0];

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: 'payment',
        ui_mode: 'embedded_page',
        return_url: data.returnUrl,
        ...(data.customerEmail && { customer_email: data.customerEmail }),
        metadata: {
          reportId: data.reportId ?? '',
        },
      });

      return session.client_secret;
    } catch (err: any) {
      console.error('[createCheckoutSession] Stripe error:', {
        message: err?.message,
        type: err?.type,
        code: err?.code,
        statusCode: err?.statusCode,
        raw: err?.raw,
      });
      throw new Error(`Stripe checkout failed: ${err?.message ?? 'unknown'}`);
    }
  });

export const verifyCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId: string; environment: StripeEnv }) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(data.sessionId)) throw new Error('Invalid sessionId');
    if (data.environment !== 'sandbox' && data.environment !== 'live') {
      throw new Error('Invalid environment');
    }
    return data;
  })
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    const paid = session.payment_status === 'paid';
    const reportId = session.metadata?.reportId ?? null;
    const customerEmail = session.customer_details?.email ?? null;

    if (paid) {
      // Record sale (idempotent via unique stripe_session_id)
      try {
        await supabaseAdmin.from('sales').upsert(
          [{
            stripe_session_id: session.id,
            report_id: reportId,
            customer_email: customerEmail,
            amount_cents: session.amount_total ?? null,
            currency: session.currency ?? null,
            environment: data.environment,
            status: 'paid',
          }],
          { onConflict: 'stripe_session_id' },
        );
      } catch (err) {
        console.error('[sales] failed to record sale', err);
      }

      // Mark linked report as paid
      if (reportId && /^[0-9a-f-]{36}$/.test(reportId)) {
        try {
          await supabaseAdmin
            .from('reports')
            .update({ paid: true, stripe_session_id: session.id, updated_at: new Date().toISOString() })
            .eq('id', reportId);
        } catch (err) {
          console.error('[reports] failed to mark paid', err);
        }
      }
    }

    return { paid, reportId, customerEmail };
  });
