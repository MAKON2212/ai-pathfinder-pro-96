import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Lock, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { estimateLiveValue } from "@/lib/live-value";
import type { AuditAnswers } from "@/lib/audit";

/**
 * Live rapport preview die naast het stappenformulier staat.
 * 4 secties ontgrendelen progressief terwijl de gebruiker vragen beantwoordt.
 */
export function LiveReportPreview({
  answers,
  unlockedCount,
  onCta,
}: {
  answers: Partial<AuditAnswers>;
  /** Aantal beantwoorde vragen (0–4+). Bepaalt welke secties unlocked zijn. */
  unlockedCount: number;
  onCta?: () => void;
}) {
  const allUnlocked = unlockedCount >= 4;

  return (
    <aside className="surface px-4 py-5 sm:px-6 sm:py-7 md:px-7 md:py-8 lg:sticky lg:top-24 lg:self-start">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            Live preview
          </span>
          <h3 className="mt-3 text-lg font-semibold tracking-tight sm:text-xl">
            Jouw rapport — in opbouw
          </h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Voltooid
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums">
            {Math.min(unlockedCount, 4)} / 4
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Section unlocked={unlockedCount >= 1} questionLabel="Beantwoord vraag 1">
          <MetricsSection answers={answers} />
        </Section>

        <Section unlocked={unlockedCount >= 2} questionLabel="Beantwoord vraag 2">
          <ImpactBars answers={answers} />
        </Section>

        <Section unlocked={unlockedCount >= 3} questionLabel="Beantwoord vraag 3">
          <ToolChips answers={answers} />
        </Section>

        <Section unlocked={unlockedCount >= 4} questionLabel="Beantwoord vraag 4">
          <Roadmap />
        </Section>
      </div>

      <button
        onClick={onCta}
        disabled={!allUnlocked}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
          allUnlocked
            ? "bg-brand text-white shadow-sm hover:opacity-90"
            : "cursor-not-allowed bg-brand/20 text-white/70",
        )}
      >
        Bekijk volledig rapport
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Indicatieve schatting op basis van sector en teamgrootte.
      </p>
    </aside>
  );
}

/** Wrapper die blur/lock-overlay toont voor nog niet-ontgrendelde secties. */
function Section({
  unlocked,
  questionLabel,
  children,
}: {
  unlocked: boolean;
  questionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5">
      <motion.div
        animate={{
          filter: unlocked ? "blur(0px)" : "blur(5px)",
          opacity: unlocked ? 1 : 0.3,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={!unlocked}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {!unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 shadow-soft">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{questionLabel}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────── Section 1: Metrics ─────────────────── */

function MetricsSection({ answers }: { answers: Partial<AuditAnswers> }) {
  const { low, high } = estimateLiveValue(answers);
  const savings = high > 0 ? Math.round((low + high) / 2) : 48_000;
  // Eenvoudige ROI-heuristiek: besparing / aangenomen investering (€ 12K).
  const roi = Math.max(2, Math.round(savings / 12_000));

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-brand" strokeWidth={2.2} />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Geschatte impact
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Besparing / jaar" value={savings} prefix="€ " />
        <MetricCard label="Verwachte ROI" value={roi} suffix="×" />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
        {prefix}
        <CountUp value={value} />
        {suffix}
      </p>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const delta = value - start;
    if (delta === 0) return;
    const dur = 800;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + delta * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display.toLocaleString("nl-NL")}</>;
}

/* ─────────────────── Section 2: Impact Bars ─────────────────── */

function ImpactBars({ answers }: { answers: Partial<AuditAnswers> }) {
  const pains = answers.painPoints || [];
  const adminScore =
    pains.includes("Administratie & facturatie") || pains.includes("Repetitief handwerk") ? 78 : 52;
  const csScore = pains.includes("Trage klantenservice") ? 84 : 48;
  const salesScore =
    pains.includes("Lead generatie") || (answers.goals || []).includes("Omzet verhogen") ? 72 : 44;

  const bars = [
    { label: "Admin", value: adminScore },
    { label: "Klantencontact", value: csScore },
    { label: "Sales", value: salesScore },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" strokeWidth={2.2} />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          AI-impact per gebied
        </p>
      </div>
      <div className="space-y-3">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{b.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">{b.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${b.value}%` }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-brand"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── Section 3: Tool chips ─────────────────── */

function ToolChips({ answers }: { answers: Partial<AuditAnswers> }) {
  const pains = answers.painPoints || [];
  const goals = answers.goals || [];
  const tools: string[] = [];
  if (pains.includes("Trage klantenservice")) tools.push("Intercom Fin", "Zendesk AI");
  if (pains.includes("Repetitief handwerk")) tools.push("n8n", "Make");
  if (pains.includes("Administratie & facturatie")) tools.push("Klippa", "Yokoy");
  if (pains.includes("Content creatie kost te veel tijd")) tools.push("ChatGPT", "Jasper");
  if (pains.includes("Lead generatie") || goals.includes("Omzet verhogen")) tools.push("Clay", "Apollo");
  if (tools.length === 0) tools.push("ChatGPT", "n8n", "Clay", "Lovable");
  const unique = Array.from(new Set(tools)).slice(0, 6);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-brand" strokeWidth={2.2} />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Aanbevolen tools
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {unique.map((tool, i) => (
          <motion.span
            key={tool}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
          >
            {tool}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── Section 4: Roadmap ─────────────────── */

function Roadmap() {
  const phases = [
    { label: "Dag 0–30", title: "Quick wins", desc: "Direct inzetbare AI-tools voor je team." },
    { label: "Dag 30–60", title: "Workflows", desc: "Automatiseer je grootste tijdsverslinders." },
    { label: "Dag 60–90", title: "Schaal", desc: "Custom integraties en KPI-meting." },
  ];
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-brand" strokeWidth={2.2} />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          90-dagen roadmap
        </p>
      </div>
      <ol className="space-y-2.5">
        {phases.map((p, i) => (
          <motion.li
            key={p.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.1 }}
            className="flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand/10 font-mono text-[10px] font-semibold text-brand">
              {i + 1}
            </span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {p.label}
              </p>
              <p className="text-sm font-semibold tracking-tight">{p.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
