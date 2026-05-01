import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Search, CheckCircle2, Circle } from "lucide-react";
import { adminListReports, type AdminReportListItem } from "@/lib/admin.functions";
import { getAdminToken } from "./admin";

export const Route = createFileRoute("/admin/")({
  component: AdminReportsList,
});

function fmtEUR(cents: number | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString("nl-NL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return s;
  }
}

function AdminReportsList() {
  const [rows, setRows] = useState<AdminReportListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    adminListReports({ data: { token } })
      .then((res) => setRows(res.reports))
      .catch((e) => setError(e instanceof Error ? e.message : "Laden mislukt"));
  }, []);

  const filtered = (rows ?? []).filter((r) => {
    if (!q.trim()) return true;
    const needle = q.toLowerCase();
    return (
      (r.company ?? "").toLowerCase().includes(needle) ||
      (r.contact_email ?? "").toLowerCase().includes(needle) ||
      (r.industry ?? "").toLowerCase().includes(needle)
    );
  });

  const totalValue = (rows ?? []).reduce((sum, r) => sum + (r.annual_value_cents ?? 0), 0);
  const paidCount = (rows ?? []).filter((r) => r.paid).length;

  return (
    <div className="mt-10">
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KPI label="Totaal rapporten" value={rows ? String(rows.length) : "…"} />
        <KPI label="Betaald" value={rows ? `${paidCount} / ${rows.length}` : "…"} />
        <KPI label="Som geschatte jaarwaarde" value={rows ? fmtEUR(totalValue) : "…"} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">Alle rapportages</h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Zoek bedrijf, e-mail, branche…"
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-xs outline-none transition focus:border-brand"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {rows === null && !error && (
        <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Laden…
        </div>
      )}

      {rows && filtered.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nog geen rapporten gevonden.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <Th>Datum</Th>
                <Th>Bedrijf</Th>
                <Th>E-mail</Th>
                <Th>Branche</Th>
                <Th className="text-right">Score</Th>
                <Th className="text-right">Jaarwaarde</Th>
                <Th>Status</Th>
                <Th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border transition hover:bg-secondary/30">
                  <Td className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">{fmtDate(r.created_at)}</Td>
                  <Td className="font-medium">{r.company ?? "—"}</Td>
                  <Td className="text-muted-foreground">{r.contact_email ?? "—"}</Td>
                  <Td className="text-muted-foreground">{r.industry ?? "—"}</Td>
                  <Td className="text-right font-mono tabular-nums">{r.score ?? "—"}{r.score != null && "%"}</Td>
                  <Td className="text-right font-mono tabular-nums">{fmtEUR(r.annual_value_cents)}</Td>
                  <Td>
                    {r.paid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                        <CheckCircle2 className="h-3 w-3" /> Betaald
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                        <Circle className="h-3 w-3" /> Preview
                      </span>
                    )}
                  </Td>
                  <Td>
                    <Link
                      to="/admin/$id"
                      params={{ id: r.id }}
                      className="inline-flex items-center justify-center rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-medium tracking-tighter tabular-nums">{value}</p>
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
