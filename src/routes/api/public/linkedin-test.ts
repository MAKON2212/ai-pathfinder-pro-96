import { createFileRoute } from "@tanstack/react-router";
import { sendLinkedInConversion } from "@/lib/linkedin.server";

export const Route = createFileRoute("/api/public/linkedin-test")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const email = url.searchParams.get("email") ?? "test@example.com";
        const amount = Number(url.searchParams.get("amount") ?? "1000");
        const currency = url.searchParams.get("currency") ?? "EUR";

        const token = process.env.LINKEDIN_CONVERSIONS_API_TOKEN;
        if (!token) {
          return Response.json({ ok: false, error: "LINKEDIN_CONVERSIONS_API_TOKEN missing" }, { status: 500 });
        }

        // Inline call so we can return the LinkedIn API response for debugging
        const sha256Hex = async (input: string) => {
          const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.trim().toLowerCase()));
          return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
        };

        const body: any = {
          conversion: "urn:lla:llaPartnerConversion:27757601",
          conversionHappenedAt: Date.now(),
          conversionValue: { currencyCode: currency.toUpperCase(), amount: (amount / 100).toFixed(2) },
          user: { userIds: [{ idType: "SHA256_EMAIL", idValue: await sha256Hex(email) }] },
        };

        const res = await fetch("https://api.linkedin.com/rest/conversionEvents", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "LinkedIn-Version": "202505",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify(body),
        });

        const text = await res.text();
        // Also fire through the helper to validate the production path
        await sendLinkedInConversion({ email, amountCents: amount, currency });

        return Response.json({ ok: res.ok, status: res.status, response: text, sent: body });
      },
    },
  },
});
