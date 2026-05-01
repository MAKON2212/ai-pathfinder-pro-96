import { createServerFn } from "@tanstack/react-start";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ----- Token helpers (HMAC over password + issued-at, server-side only) -----

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const pw = process.env.ADMIN_PORTAL_PASSWORD;
  if (!pw) throw new Error("ADMIN_PORTAL_PASSWORD not configured");
  return pw;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function makeToken(): string {
  const issued = Date.now().toString();
  const sig = sign(issued);
  return `${issued}.${sig}`;
}

function verifyToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  const issuedNum = Number(issued);
  if (!Number.isFinite(issuedNum)) return false;
  if (Date.now() - issuedNum > TOKEN_TTL_MS) return false;
  const expected = sign(issued);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ----- Server functions -----

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (typeof input?.password !== "string" || input.password.length < 1 || input.password.length > 200) {
      throw new Error("Invalid password");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const expected = getSecret();
    const a = Buffer.from(data.password);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      // small async delay to slow brute force
      await new Promise((r) => setTimeout(r, 600));
      throw new Error("Onjuist wachtwoord");
    }
    return { token: makeToken() };
  });

export type AdminReportListItem = {
  id: string;
  company: string | null;
  contact_email: string | null;
  industry: string | null;
  score: number | null;
  annual_value_cents: number | null;
  currency: string | null;
  paid: boolean;
  source: string | null;
  created_at: string;
};

export const adminListReports = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => {
    if (typeof input?.token !== "string") throw new Error("Invalid token");
    return input;
  })
  .handler(async ({ data }): Promise<{ reports: AdminReportListItem[] }> => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const { data: rows, error } = await supabaseAdmin
      .from("reports")
      .select("id, company, contact_email, industry, score, annual_value_cents, currency, paid, source, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { reports: (rows || []) as AdminReportListItem[] };
  });

export const adminGetReport = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string; id: string }) => {
    if (typeof input?.token !== "string") throw new Error("Invalid token");
    if (typeof input?.id !== "string" || !/^[0-9a-f-]{36}$/.test(input.id)) {
      throw new Error("Invalid id");
    }
    return input;
  })
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) throw new Error("Unauthorized");
    const { data: row, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Niet gevonden");
    return { report: row };
  });
