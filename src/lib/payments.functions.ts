import { createServerFn } from '@tanstack/react-start';
import { type StripeEnv, createStripeClient } from './stripe.server';

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

    const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
    if (!prices.data.length) throw new Error('Price not found');
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
    return {
      paid: session.payment_status === 'paid',
      reportId: session.metadata?.reportId ?? null,
      customerEmail: session.customer_details?.email ?? null,
    };
  });
