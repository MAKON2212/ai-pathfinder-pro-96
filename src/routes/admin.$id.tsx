import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, CheckCircle2, Circle } from "lucide-react";
import { adminGetReport } from "@/lib/admin.functions";
import { getAdminToken } from "./admin";
import type { GeneratedReport } from "@/lib/report.functions";
import type { AuditAnswers } from "@/lib/audit";

export const Route = createFileRoute("/admin/$id")({
  component: AdminReportDetail,
});

type ReportRow = {
  id: string;
  company: string | null;
  contact_email: string | null;
  industry: string | null;
  team_size: string | null;
  score: number | null;
  annual_value_cents: number | null;
  currency: string | null;
  paid: boolean;
  source: string | null;
  stripe_session_id: string | null;
  created_at: string;
  answers: AuditAnswers | null;
  report: GeneratedReport | null;
};

function fmtEUR(cents: number | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

function AdminReportDetail() {
  const { id } = Route.useParams();
  const [row, setRow] = useState<ReportRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    adminGetReport({ data: { token, id } })
      .then((res) => setRow(res.report as ReportRow))
      .catch((e) => setError(e instanceof Error ? e.message : "Laden mislukt"));
  }, [id]);

  if (error) {
    return (
      <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }
  if (!row) {
    return (
      <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Laden…
      </div>
    );
  }

  const r = row.report;

  return (
    <div className="mt-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Terug naar overzicht
      </Link>

      <div className="mt-6 flex items-start justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Rapport</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tighter">{row.company ?? "Onbekend bedrijf"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {row.contact_email ?? "geen e-mail"} · {row.industry ?? "geen branche"} · {new Date(row.created_at).toLocaleString("nl-NL")}
          </p>
        </div>
        <div className="text-right">
          {row.paid ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              <CheckCircle2 className="h-3.5 w-3.5" /> Betaald
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Circle className="h-3.5 w-3.5" /> Preview
            </span>
          )}
          {row.stripe_session_id && (
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">{row.stripe_session_id}</p>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat label="Geschatte jaarwaarde" value={fmtEUR(row.annual_value_cents)} />
        <Stat label="Gem. score" value={row.score != null ? `${row.score}%` : "—"} />
        <Stat label="Team" value={row.team_size ?? "—"} />
        <Stat label="Bron" value={row.source ?? "—"} />
      </div>

      {r && (
        <>
          <Section title="Executive summary">
            <p className="text-sm leading-relaxed text-foreground/85">{r.executiveSummary}</p>
          </Section>

          <Section title="Waarde-onderbouwing">
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40">
                  <tr className="text-left">
                    <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Post</th>
                    <th className="px-4 py-2 text-right font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Bedrag</th>
                    <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Formule</th>
                  </tr>
                </thead>
                <tbody>
                  {r.valueLineItems.map((li) => (
                    <tr key={li.label} className="border-t border-border">
                      <td className="px-4 py-2 font-medium">{li.label}</td>
                      <td className="px-4 py-2 text-right font-mono tabular-nums">{new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(li.amount)}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-brand">{li.formula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Hoofdstukken">
            <div className="space-y-4">
              {r.chapters.map((c) => (
                <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-base font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{c.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Aanbevolen tools">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {r.tools.map((t) => (
                <div key={t.name} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{t.name}</p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t.category}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{t.useCase}</p>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      <Section title="Antwoorden uit audit">
        <pre className="max-h-[600px] overflow-auto rounded-2xl border border-border bg-secondary/30 p-4 font-mono text-[11px] leading-relaxed">
{JSON.stringify(row.answers, null, 2)}
        </pre>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-medium tabular-nums">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
