import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const reportId = session.metadata?.reportId ?? null;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;

  // Idempotent sale insert
  try {
    await supabaseAdmin.from("sales").upsert(
      [{
        stripe_session_id: session.id,
        report_id: reportId,
        customer_email: customerEmail,
        amount_cents: session.amount_total ?? null,
        currency: session.currency ?? null,
        environment: env,
        status: "paid",
      }],
      { onConflict: "stripe_session_id" },
    );
  } catch (err) {
    console.error("[webhook] sales insert failed", err);
  }

  // Mark report paid + attach email
  if (reportId && /^[0-9a-f-]{36}$/.test(reportId)) {
    try {
      const updates: Record<string, unknown> = {
        paid: true,
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      };
      if (customerEmail) updates.contact_email = customerEmail;
      await supabaseAdmin.from("reports").update(updates).eq("id", reportId);
    } catch (err) {
      console.error("[webhook] reports update failed", err);
    }
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("[webhook] missing/invalid env query param:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
              await handleCheckoutCompleted(event.data.object, env);
              break;
            default:
              console.log("[webhook] unhandled event:", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("[webhook] error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
