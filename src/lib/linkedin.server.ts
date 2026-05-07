// LinkedIn Conversions API helper
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api

const CONVERSION_RULE_ID = 27757601;
const CONVERSION_URN = `urn:lla:llaPartnerConversion:${CONVERSION_RULE_ID}`;

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sendLinkedInConversion(opts: {
  email?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  eventTimeMs?: number;
}): Promise<void> {
  const token = process.env.LINKEDIN_CONVERSIONS_API_TOKEN;
  if (!token) {
    console.error('[linkedin] LINKEDIN_CONVERSIONS_API_TOKEN not configured');
    return;
  }

  const body: any = {
    conversion: CONVERSION_URN,
    conversionHappenedAt: opts.eventTimeMs ?? Date.now(),
  };

  if (opts.amountCents != null && opts.currency) {
    body.conversionValue = {
      currencyCode: opts.currency.toUpperCase(),
      amount: (opts.amountCents / 100).toFixed(2),
    };
  }

  if (opts.email) {
    body.user = {
      userIds: [{ idType: 'SHA256_EMAIL', idValue: await sha256Hex(opts.email) }],
    };
  }

  try {
    const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202505',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[linkedin] conversion failed', res.status, text);
    } else {
      console.log('[linkedin] conversion sent', { amountCents: opts.amountCents });
    }
  } catch (err) {
    console.error('[linkedin] conversion error', err);
  }
}
