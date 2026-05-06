import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { createCheckoutSession } from '@/lib/payments.functions';

interface Props {
  priceId: string;
  customerEmail?: string;
  reportId?: string;
  returnUrl: string;
}

export function StripeEmbeddedCheckout({ priceId, customerEmail, reportId, returnUrl }: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = await createCheckoutSession({
      data: {
        priceId,
        customerEmail,
        reportId,
        returnUrl,
        environment: getStripeEnvironment(),
      },
    });
    if (!result || !result.ok) {
      const msg = result && 'error' in result ? JSON.stringify(result.error) : 'Unknown error';
      console.error('[StripeEmbeddedCheckout] createCheckoutSession failed:', result);
      alert('Checkout error: ' + msg);
      throw new Error('Checkout failed: ' + msg);
    }
    if (!result.clientSecret) throw new Error('No client secret returned');
    return result.clientSecret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
