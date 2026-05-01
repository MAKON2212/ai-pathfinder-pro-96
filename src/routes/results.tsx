import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, TrendingUp, Check, Clock, Info, Globe, Zap, CalendarDays, ShieldAlert, Lock, Sparkles } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { GeneratedReport } from "@/lib/report.functions";
import { generatePDF } from "@/lib/pdf.functions";
import { ReviewSlider } from "@/components/ReviewSlider";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { verifyCheckoutSession } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PAID_KEY = "audit_report_paid";

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
    checkout: typeof search.checkout === "string" ? search.checkout : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Jouw AI Roadmap · ScanAI" },
      { name: "description", content: "Persoonlijk AI-rapport: scores, roadmap en geldwaarde." },
      { property: "og:title", content: "Jouw AI Roadmap · ScanAI" },
      { property: "og:description", content: "Persoonlijke AI roadmap & geldwaarde-analyse voor jouw bedrijf." },
    ],
  }),
  component: ResultsPage,
});

function Score({
  label,
  value,
  n,
  delay = 0,
  rationale,
  drivers,
}: {
  label: string;
  value: number;
  n: string;
  delay?: number;
  rationale?: string;
  drivers?: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="surface rounded-3xl p-7"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[11px] text-brand">{n}</span>
      </div>
      <p className="mt-5 text-5xl font-medium tracking-tighter">
        {value}
        <span className="text-xl text-muted-foreground">%</span>
      </p>
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full bg-brand"
        />
      </div>
      {rationale && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{rationale}</p>
      )}
      {drivers && drivers.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {drivers.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[11px] text-foreground/75">
              <span className="mt-1 h-1 w-1 flex-none rounded-full bg-brand" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function CountdownPill({ expiresAt }: { expiresAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(0, expiresAt - now);
  const m = Math.floor(remaining / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  const expired = remaining <= 0;
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${expired ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-brand/40 bg-brand/10 text-brand"}`}>
      <Clock className="h-3.5 w-3.5" />
      <span className="font-mono">
        {expired ? "Verlopen" : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`}
      </span>
      <span className="text-foreground/70">
        {expired ? "— genereer opnieuw" : "We houden je winstplan beschikbaar"}
      </span>
    </div>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [paid, setPaid] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("audit_report");
    const ans = sessionStorage.getItem("audit_answers");
    if (!raw || !ans) {
      navigate({ to: "/audit" });
      return;
    }
    setReport(JSON.parse(raw));
    try { setCompanyName(JSON.parse(ans).companyName || ""); } catch { /* ignore */ }
    const exp = sessionStorage.getItem("audit_report_expires_at");
    if (exp) setExpiresAt(Number(exp));
    else {
      const fresh = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem("audit_report_expires_at", String(fresh));
      setExpiresAt(fresh);
    }
    if (sessionStorage.getItem(PAID_KEY) === "true") setPaid(true);
  }, [navigate]);

  // Verify Stripe return
  useEffect(() => {
    if (!search.session_id || paid) return;
    let cancelled = false;
    setVerifying(true);
    verifyCheckoutSession({ data: { sessionId: search.session_id, environment: getStripeEnvironment() } })
      .then((res) => {
        if (cancelled) return;
        if (res.paid) {
          sessionStorage.setItem(PAID_KEY, "true");
          setPaid(true);
          setCheckoutOpen(false);
        }
      })
      .catch((e) => console.error("Verify failed:", e))
      .finally(() => { if (!cancelled) setVerifying(false); });
    return () => { cancelled = true; };
  }, [search.session_id, paid]);

  if (!report) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Resultaten laden…</p>
      </div>
    );
  }

  const handleUnlock = async () => {
    if (!report || downloading) return;
    if (!paid) { setCheckoutOpen(true); return; }
    setDownloading(true);
    try {
      const res = await generatePDF({ data: { companyName: companyName || "ScanAI", report } });
      const byteChars = atob(res.base64);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download failed:", e);
      alert("Download mislukt — probeer opnieuw.");
    } finally {
      setDownloading(false);
    }
  };

  const openCheckout = () => setCheckoutOpen(true);
  const returnUrl = typeof window !== "undefined"
    ? `${window.location.origin}/results?checkout=success&session_id={CHECKOUT_SESSION_ID}`
    : "/results";

  const fmtEUR = (n: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <>
    <PaymentTestModeBanner />
    <div className="px-6">
      <div className="mx-auto max-w-7xl py-24">
        {verifying && (
          <div className="mb-6 rounded-2xl border border-brand/30 bg-brand/5 px-5 py-3 text-sm text-brand">
            Betaling controleren…
          </div>
        )}
        {paid && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-medium text-brand">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            Volledig rapport ontgrendeld
          </div>
        )}
        {/* Header — title + review slider top right */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 items-end gap-8 border-b border-border pb-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill">· Persoonlijke AI-analyse</span>
              {expiresAt && <CountdownPill expiresAt={expiresAt} />}
              {report.companyContext.scrapedFrom && report.companyContext.scrapedPages.length > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand"
                  title={report.companyContext.scrapedPages.join("\n")}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Bron: website geanalyseerd ({report.companyContext.scrapedPages.length} pagina{report.companyContext.scrapedPages.length === 1 ? "" : "'s"})
                </span>
              )}
            </div>
            <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-6xl">
              De AI Roadmap voor <span className="text-brand">{companyName || "jouw bedrijf"}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              {report.executiveSummary}
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <ReviewSlider />
          </div>
        </motion.div>

        {/* PRIMARY VALUE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="surface relative mt-12 overflow-hidden rounded-[2rem] p-10 md:p-14"
        >
          <div className="absolute -top-1/2 -right-1/4 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.06),transparent_60%)]" />
          <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 text-brand">
                <TrendingUp className="h-4 w-4" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                  Geschatte jaarlijkse waarde voor {companyName || "jouw bedrijf"}
                </span>
              </div>
              <p className="mt-4 text-6xl font-semibold tracking-tighter text-foreground md:text-7xl">
                {report.formattedValue}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Opgebouwd uit vier transparante posten — hieronder zie je per post de rekensom én waarom het zo gewogen is op basis van jouw doelen.
              </p>
              <div className="surface mt-6 rounded-2xl border border-brand/30 bg-card p-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Wat zit er in het rapport
                </span>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    `Persoonlijke analyse voor ${companyName || "jouw bedrijf"}`,
                    "90-dagen actieplan met concrete stappen",
                    "Aanbevolen tool stack op maat",
                    "Radar-diagram met benchmark-vergelijking",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-brand" strokeWidth={3} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Transparent value breakdown table */}
            <div className="md:col-span-7">
              <div className="surface overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border bg-secondary/40 px-5 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Onderbouwing — zo komen we aan {report.formattedValue}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {report.valueLineItems.map((it) => (
                    <div key={it.label} className="px-5 py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-sm font-semibold">{it.label}</p>
                        <p className="font-mono text-base font-semibold tabular-nums">{fmtEUR(it.amount)}</p>
                      </div>
                      <p className="mt-1.5 font-mono text-[11px] text-brand">{it.formula}</p>
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Info className="mt-0.5 h-3 w-3 flex-none" />
                        <span>{it.rationale}</span>
                      </p>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 bg-brand/5 px-5 py-4">
                    <p className="text-sm font-semibold">Totaal jaarlijkse waarde</p>
                    <p className="font-mono text-xl font-semibold tabular-nums text-brand">{report.formattedValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RADAR + SCORES */}
        <section className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="surface rounded-3xl p-8 lg:col-span-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">AI maturity profile</span>
                <h2 className="mt-2 text-2xl font-medium tracking-tight">{companyName || "Jouw bedrijf"} vs. branche-benchmark</h2>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" />Jouw score</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground/30" />Benchmark</span>
              </div>
            </div>
            <div className="mt-4 h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={report.radar} outerRadius="75%">
                  <PolarGrid stroke="oklch(0.18 0.01 60 / 0.10)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "oklch(0.30 0.01 60)", fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis domain={[0, 100]} angle={90} tick={false} stroke="transparent" />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="oklch(0.18 0.01 60 / 0.45)" fill="oklch(0.18 0.01 60 / 0.10)" strokeWidth={1.5} />
                  <Radar name="Jouw score" dataKey="value" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.28} strokeWidth={2} />
                  <Legend wrapperStyle={{ display: "none" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              De radar toont 6 assen die we toetsen op AI-volwassenheid. Hoe groter het brand-gekleurde vlak, hoe meer hefboom er ligt voor {companyName || "jouw bedrijf"}.
            </p>
          </motion.div>

          <div className="space-y-6 lg:col-span-5">
            <Score n="01" label="AI Readiness" value={report.scores.readiness} delay={0.1} rationale={report.scoreDetails.readiness.rationale} drivers={report.scoreDetails.readiness.drivers} />
            <Score n="02" label="Automation Potential" value={report.scores.automation} delay={0.2} rationale={report.scoreDetails.automation.rationale} drivers={report.scoreDetails.automation.drivers} />
            <Score n="03" label="Business Impact" value={report.scores.impact} delay={0.3} rationale={report.scoreDetails.impact.rationale} drivers={report.scoreDetails.impact.drivers} />
          </div>
        </section>

        {/* PAYWALL: alles hieronder is alleen volledig zichtbaar na betaling */}
        <div className="relative">
          <div className={paid ? "" : "pointer-events-none select-none [filter:blur(8px)] opacity-60"} aria-hidden={!paid}>

        {/* AI Generated chapters */}
        <section className="mt-24">
          <div>
            <span className="pill">· Volledig rapport</span>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
              {report.chapters.length} hoofdstukken<br />op maat van {companyName || "jouw bedrijf"}.
            </h2>
          </div>

          <div className="mt-10 space-y-6">
            {report.chapters.map((c, idx) => (
              <div key={c.title} className="surface rounded-3xl p-10 md:p-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Hoofdstuk {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-3xl font-medium tracking-tighter">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="mt-24">
          <div>
            <span className="pill">· Implementatie roadmap</span>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
              Een gefaseerd plan,<br />op maat van {companyName || "jouw organisatie"}.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {report.roadmap.map((r, i) => (
              <motion.div
                key={r.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="surface rounded-3xl p-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{r.phase}</p>
                <h3 className="mt-4 text-2xl font-medium tracking-tight">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mt-24">
          <div>
            <span className="pill">· Aanbevolen tools</span>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
              Geselecteerd op basis van<br />jouw uitdagingen en doelen.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {report.tools.map((t, i) => {
              const cardInner = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=128`}
                        alt={`${t.name} logo`}
                        className="h-8 w-8 object-contain"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-brand" />
                  </div>
                  <span className="mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{t.category}</span>
                  <h3 className="mt-2 text-xl font-medium tracking-tight">{t.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
                  {(t.pricing || t.setupTime) && (
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                      {t.pricing && (
                        <div className="rounded-lg border border-border bg-card/40 px-2.5 py-1.5">
                          <p className="font-mono uppercase tracking-wider text-muted-foreground">Prijs</p>
                          <p className="mt-0.5 font-medium text-foreground">{t.pricing}</p>
                        </div>
                      )}
                      {t.setupTime && (
                        <div className="rounded-lg border border-border bg-card/40 px-2.5 py-1.5">
                          <p className="font-mono uppercase tracking-wider text-muted-foreground">Setup</p>
                          <p className="mt-0.5 font-medium text-foreground">{t.setupTime}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="text-brand">Use-case · </span>
                    {t.useCase}
                  </div>
                  {t.firstStep && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="text-brand">Eerste stap · </span>
                      {t.firstStep}
                    </div>
                  )}
                  {t.slug && (
                    <div className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-brand">
                      Bekijk use-cases & instapstappen <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </>
              );

              const className = "surface group block rounded-3xl p-7 transition hover:border-brand/40";
              const motionProps = {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-50px" },
                transition: { duration: 0.4, delay: i * 0.04 },
              };

              return t.slug ? (
                <motion.div key={t.name} {...motionProps}>
                  <Link to="/tools/$slug" params={{ slug: t.slug }} className={className}>
                    {cardInner}
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={t.name}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...motionProps}
                  className={className}
                >
                  {cardInner}
                </motion.a>
              );
            })}
          </div>
        </section>

        {/* Quick wins */}
        {report.quickWins?.length > 0 && (
          <section className="mt-24">
            <div>
              <span className="pill">· Quick wins deze week</span>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
                Drie dingen die je<br />vandaag kunt starten.
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {report.quickWins.map((q, i) => (
                <motion.div
                  key={q.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="surface rounded-3xl p-7"
                >
                  <Zap className="h-5 w-5 text-brand" />
                  <h3 className="mt-4 text-lg font-medium tracking-tight">{q.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full border border-border bg-card/40 px-2.5 py-1 font-mono uppercase tracking-wider text-muted-foreground">
                      {q.effort}
                    </span>
                    <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono uppercase tracking-wider text-brand">
                      {q.impact}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{q.howTo}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 90-dagen weekplan */}
        {report.weeklyPlan?.length > 0 && (
          <section className="mt-24">
            <div>
              <span className="pill">· 90-dagen actieplan</span>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
                Week voor week,<br />wat je concreet doet.
              </h2>
            </div>
            <div className="mt-12 space-y-4">
              {report.weeklyPlan.map((w, i) => (
                <motion.div
                  key={w.week}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="surface flex flex-col gap-4 rounded-3xl p-7 md:flex-row md:items-start"
                >
                  <div className="flex flex-none items-center gap-3 md:w-56">
                    <CalendarDays className="h-5 w-5 text-brand" />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">{w.week}</p>
                      <p className="mt-1 text-base font-medium">{w.focus}</p>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-2">
                    {w.actions.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 flex-none text-brand" strokeWidth={3} />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Sensitivity / scenario's */}
        {report.sensitivity?.length > 0 && (
          <section className="mt-24">
            <div>
              <span className="pill">· Risico & scenario's</span>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
                Worst, base & best case.<br />
                <span className="text-brand">Eerlijke onderkant.</span>
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {report.sensitivity.map((s, i) => {
                const accent = s.label === "Best case" ? "border-brand/40 bg-brand/5" : s.label === "Worst case" ? "border-destructive/30 bg-destructive/5" : "";
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={`surface rounded-3xl p-7 ${accent}`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-brand" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tighter">{fmtEUR(s.estimatedValue)}</p>
                    <p className="mt-1 font-mono text-[11px] text-brand">× {s.multiplier.toFixed(2)} multiplier</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.rationale}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="mt-24">
          <div className="surface relative overflow-hidden rounded-[2rem] p-10 md:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,113,227,0.05),transparent_60%)]" />
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <span className="pill">· Volgende stap</span>
                <h2 className="mt-5 text-balance text-3xl font-medium tracking-tighter md:text-5xl">
                  Klaar om <span className="text-brand">{report.formattedValue}</span><br />
                  per jaar te verzilveren?
                </h2>
                <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                  {paid
                    ? `Print of bewaar de complete AI-roadmap voor ${companyName || "jouw bedrijf"}.`
                    : `Ontgrendel het volledige rapport voor ${companyName || "jouw bedrijf"} — eenmalig € 29.`}
                </p>
              </div>
              <div className="flex flex-col gap-3 md:col-span-4">
                <button
                  onClick={handleUnlock}
                  disabled={downloading}
                  className="inline-flex items-center justify-between gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  <span className="inline-flex items-center gap-2">
                    {paid ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {paid
                      ? (downloading ? "PDF wordt gemaakt…" : "Download PDF rapport")
                      : "Ontgrendel volledig rapport — € 29"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
      <DialogContent className="max-w-2xl p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>Volledig AI-rapport ontgrendelen</DialogTitle>
          <DialogDescription>
            Eenmalig € 29 — direct toegang tot de complete roadmap, tools, blueprints en PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto px-2 py-2">
          {checkoutOpen && (
            <StripeEmbeddedCheckout
              priceId="ai_check_report_one_time"
              returnUrl={returnUrl}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
