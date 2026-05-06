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
    console.error('[createCheckoutSession] validator entered', JSON.stringify(data));
    if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error('Invalid priceId');
    if (data.environment !== 'sandbox' && data.environment !== 'live') {
      throw new Error('Invalid environment');
    }
    return data;
  })
  .handler(async ({ data }) => {
    console.error('[createCheckoutSession] handler entered', JSON.stringify(data));
    try {
      const stripe = createStripeClient(data.environment);
      console.error('[createCheckoutSession] stripe client created');
      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      console.error('[createCheckoutSession] prices.list ok, count=', prices.data.length);
      if (!prices.data.length) {
        return { ok: false as const, stage: 'price_lookup', error: 'Price not found for lookup_key=' + data.priceId };
      }
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
      console.error('[createCheckoutSession] session created', session.id);

      return { ok: true as const, clientSecret: session.client_secret };
    } catch (err: any) {
      const detail = {
        message: String(err?.message ?? err),
        name: String(err?.name ?? ''),
        type: String(err?.type ?? ''),
        code: String(err?.code ?? ''),
        statusCode: err?.statusCode ?? null,
        raw: err?.raw ? JSON.stringify(err.raw) : null,
        stack: String(err?.stack ?? ''),
      };
      console.error('[createCheckoutSession] error:', detail);
      return { ok: false as const, stage: 'exception', error: detail };
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
