import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const trackAuditSession = createServerFn({ method: "POST" })
  .inputValidator((data: {
    sessionKey: string;
    currentStep: number;
    maxStepReached: number;
    totalSteps: number;
    lastStepKey?: string;
    company?: string;
    industry?: string;
    teamSize?: string;
    answers?: Record<string, unknown>;
    completed?: boolean;
    reportId?: string;
    userAgent?: string;
    referrer?: string;
    landingPath?: string;
    deviceType?: string;
  }) => {
    if (!data.sessionKey || data.sessionKey.length > 80) {
      throw new Error("Invalid sessionKey");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const payload = {
        session_key: data.sessionKey,
        current_step: data.currentStep,
        max_step_reached: data.maxStepReached,
        total_steps: data.totalSteps,
        last_step_key: data.lastStepKey ?? null,
        company: data.company ?? null,
        industry: data.industry ?? null,
        team_size: data.teamSize ?? null,
        answers: (data.answers ?? null) as never,
        completed: data.completed ?? false,
        completed_at: data.completed ? new Date().toISOString() : null,
        report_id: data.reportId ?? null,
        user_agent: data.userAgent ?? null,
        referrer: data.referrer ?? null,
        landing_path: data.landingPath ?? null,
        device_type: data.deviceType ?? null,
      };

      await supabaseAdmin
        .from("audit_sessions")
        .upsert([payload], { onConflict: "session_key" });

      return { ok: true as const };
    } catch (err) {
      console.error("[trackAuditSession] failed:", err);
      return { ok: false as const };
    }
  });
