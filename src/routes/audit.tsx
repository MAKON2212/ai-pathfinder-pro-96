import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Lock, Sparkles } from "lucide-react";
import { ValueMeter } from "@/components/ValueMeter";
import { calcMissedValue, formatEUR, type ValueAnswers } from "@/lib/value-calc";
import {
  INDUSTRIES,
  SIZES,
  HOURLY_COSTS,
  REPETITIVE_HOURS,
  PAIN_POINTS,
  GROSS_MARGINS,
  type AuditAnswers,
} from "@/lib/audit";
import { cn } from "@/lib/utils";
import { trackAuditSession } from "@/lib/audit-tracking.functions";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Calculate how much money you're missing without AI · ScanAI" },
      { name: "description", content: "Answer 7 short questions and instantly see how much revenue your business is losing each year by not using AI." },
      { property: "og:title", content: "How much money are you missing out on? · ScanAI" },
      { property: "og:description", content: "Free calculation in 90 seconds. You get the number right away — the how-to report you unlock after." },
    ],
  }),
  component: AuditPage,
});

const MISSED_LEADS = ["0", "1 – 5", "5 – 20", "20+"];

type StepKey =
  | "industry"
  | "size"
  | "avgHourlyCost"
  | "repetitiveHoursPerWeek"
  | "painPoints"
  | "grossMargin"
  | "missedLeadsPerMonth";

type Step = {
  key: StepKey;
  title: string;
  subtitle: string;
  type: "single" | "multi";
  options: string[];
  /** When set, options are visually compact (chips) — better for long lists. */
  compact?: boolean;
};

const STEPS: Step[] = [
  {
    key: "industry",
    title: "What industry do you work in?",
    subtitle: "Determines the typical deal value in your market.",
    type: "single",
    options: INDUSTRIES,
    compact: true,
  },
  {
    key: "size",
    title: "How many people work at your company?",
    subtitle: "The bigger the team, the more hours per year you gain with AI.",
    type: "single",
    options: SIZES,
  },
  {
    key: "avgHourlyCost",
    title: "What is your average hourly cost?",
    subtitle: "Including employer costs — for a fair savings calculation.",
    type: "single",
    options: HOURLY_COSTS,
  },
  {
    key: "repetitiveHoursPerWeek",
    title: "How many hours per week go to repetitive work?",
    subtitle: "Think manual copying, replying, sorting, data entry.",
    type: "single",
    options: REPETITIVE_HOURS,
  },
  {
    key: "painPoints",
    title: "What are your biggest time-wasters?",
    subtitle: "Pick everything that applies — more pain = more upside.",
    type: "multi",
    options: PAIN_POINTS,
  },
  {
    key: "grossMargin",
    title: "What is your gross margin?",
    subtitle: "The higher the margin, the more a lost customer really costs.",
    type: "single",
    options: GROSS_MARGINS,
  },
  {
    key: "missedLeadsPerMonth",
    title: "How many customers do you lose per month due to capacity?",
    subtitle: "Honest estimate — leads you couldn't get to or couldn't help.",
    type: "single",
    options: MISSED_LEADS,
  },
];

type Answers = Partial<Record<StepKey, string | string[]>>;

function detectDeviceType(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|iphone|android.+mobile/.test(ua)) return "mobile";
  if (/ipad|tablet|android(?!.*mobile)/.test(ua)) return "tablet";
  return "desktop";
}

function AuditPage() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealed, setRevealed] = useState(false);
  const sessionKeyRef = useRef<string>("");
  const maxStepRef = useRef<number>(0);
  const prevValueRef = useRef<number>(0);

  const step = STEPS[stepIdx];
  const total = STEPS.length;

  // Build session key once
  useEffect(() => {
    let k = sessionStorage.getItem("audit_session_key");
    if (!k) {
      k = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("audit_session_key", k);
    }
    sessionKeyRef.current = k;
  }, []);

  // Track on each step change
  useEffect(() => {
    if (!sessionKeyRef.current) return;
    maxStepRef.current = Math.max(maxStepRef.current, stepIdx);
    const t = setTimeout(() => {
      trackAuditSession({
        data: {
          sessionKey: sessionKeyRef.current,
          currentStep: stepIdx,
          maxStepReached: maxStepRef.current,
          totalSteps: total,
          lastStepKey: step.key,
          industry: typeof answers.industry === "string" ? answers.industry : undefined,
          teamSize: typeof answers.size === "string" ? answers.size : undefined,
          answers: answers as Record<string, unknown>,
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined,
          landingPath: window.location.pathname,
          deviceType: detectDeviceType(),
        },
      }).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  const calc = useMemo(() => calcMissedValue(answers as ValueAnswers), [answers]);

  const isAnswered = (() => {
    const v = answers[step.key];
    if (step.type === "multi") return Array.isArray(v) && v.length > 0;
    return typeof v === "string" && v.length > 0;
  })();

  const pickSingle = (value: string) => {
    setAnswers((a) => ({ ...a, [step.key]: value }));
    // auto-advance with a short delay so the meter animation registers
    setTimeout(() => {
      if (stepIdx < total - 1) setStepIdx((i) => i + 1);
    }, 280);
  };

  const toggleMulti = (value: string) => {
    setAnswers((a) => {
      const cur = (a[step.key] as string[] | undefined) ?? [];
      const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
      return { ...a, [step.key]: next };
    });
  };

  const goNext = () => {
    if (!isAnswered) return;
    if (stepIdx < total - 1) {
      setStepIdx((i) => i + 1);
    } else {
      reveal();
    }
  };

  const goBack = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const reveal = () => {
    setRevealed(true);
    // Persist for the existing /results paywall flow.
    const compatAnswers: Partial<AuditAnswers> & Record<string, unknown> = {
      industry: (answers.industry as string) ?? "",
      size: (answers.size as string) ?? "",
      avgHourlyCost: (answers.avgHourlyCost as string) ?? "",
      repetitiveHoursPerWeek: (answers.repetitiveHoursPerWeek as string) ?? "",
      painPoints: (answers.painPoints as string[]) ?? [],
      grossMargin: (answers.grossMargin as string) ?? "",
      missedLeadsPerMonth: answers.missedLeadsPerMonth,
      companyName: "",
      revenue: "",
      techStack: [],
      goals: [],
      budget: "",
      outcome: "",
      timeline: "",
      website: "",
      customerValue: "",
      customersPerYear: "",
    };
    sessionStorage.setItem("audit_answers", JSON.stringify(compatAnswers));
    sessionStorage.setItem("audit_value_total", String(calc.total));
    if (sessionKeyRef.current) {
      trackAuditSession({
        data: {
          sessionKey: sessionKeyRef.current,
          currentStep: total,
          maxStepReached: total,
          totalSteps: total,
          lastStepKey: step.key,
          industry: typeof answers.industry === "string" ? answers.industry : undefined,
          teamSize: typeof answers.size === "string" ? answers.size : undefined,
          answers: answers as Record<string, unknown>,
          completed: true,
        },
      }).catch(() => {});
    }
  };

  const delta = calc.total - prevValueRef.current;
  useEffect(() => { prevValueRef.current = calc.total; }, [calc.total]);

  if (revealed) {
    return <ValueReveal value={calc.total} low={calc.low} high={calc.high} answers={answers} />;
  }

  return (
    <div className="mx-auto w-full max-w-md pb-36 sm:max-w-lg lg:max-w-2xl">

      {/* ── Live meter card ── */}
      <div className="mx-3 mt-3 sm:mx-5">
        <div
          className="relative overflow-hidden rounded-[20px] p-[18px]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* bg glow */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(201,166,100,0.18), transparent 60%)" }} />

          {/* Header row */}
          <div className="relative flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#E8CB85" }}>
              Live Value Scan
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
              style={{ background: "rgba(201,166,100,0.12)", border: "1px solid rgba(201,166,100,0.3)", color: "#E8CB85" }}
            >
              <span className="live-dot" />
              Updating
            </span>
          </div>

          {/* Big value */}
          <motion.div
            key={calc.total}
            initial={{ opacity: 0.6, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mt-3 flex items-baseline gap-1 font-semibold tabular-nums leading-none tracking-[-0.04em]"
            style={{
              fontSize: 52,
              background: "linear-gradient(180deg, #FFE8A8 0%, #C9A664 60%, #876B2C 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span style={{ fontSize: 28 }}>€</span>
            {calc.total > 0 ? Math.round(calc.total).toLocaleString("nl-NL") : "–"}
            <span className="ml-1.5 text-[13px] font-medium" style={{ color: "rgba(245,236,215,0.5)", WebkitTextFillColor: "rgba(245,236,215,0.5)" }}>
              / year
            </span>
          </motion.div>

          {/* Delta */}
          {delta > 0 && (
            <div className="mt-1.5 flex items-center gap-1 text-[12px] font-medium tabular-nums" style={{ color: "#E8CB85" }}>
              <span style={{ fontSize: 9 }}>▲</span>
              + €{Math.round(delta).toLocaleString("nl-NL")} since previous question
            </div>
          )}

          {/* Progress */}
          <div className="mt-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "rgba(245,236,215,0.5)" }}>
                Progress · <b style={{ color: "#f5ecd7" }}>0{stepIdx + 1}/0{total}</b>
              </span>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: "#E8CB85" }}>
                {Math.round(((stepIdx + (isAnswered ? 1 : 0)) / total) * 100)}%
              </span>
            </div>
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-[2px] transition-all"
                  style={
                    i < stepIdx
                      ? { background: "linear-gradient(90deg, #876B2C, #C9A664)" }
                      : i === stepIdx
                      ? { background: "#E8CB85", boxShadow: "0 0 12px rgba(201,166,100,0.6)" }
                      : { background: "rgba(255,255,255,0.06)" }
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Question ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="px-4 pt-8 sm:px-5"
        >
          {/* Question tag */}
          <div className="inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[11px] font-medium" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(245,236,215,0.7)" }}>
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold tabular-nums"
              style={{ background: "linear-gradient(135deg, #E8CB85, #876B2C)", color: "#14110a" }}
            >
              {String(stepIdx + 1).padStart(2, "0")}
            </span>
            {step.type === "multi" ? "Multiple choice" : "Single choice"}
          </div>

          <h1
            className="mt-4 font-semibold leading-[1.02] tracking-[-0.04em]"
            style={{ fontSize: "clamp(28px, 8vw, 36px)", color: "#f5ecd7" }}
          >
            {step.title.includes("biggest") ? (
              <>What are your biggest <em className="not-italic" style={{ background: "linear-gradient(180deg, #FFE8A8, #C9A664, #876B2C)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>time-wasters</em>?</>
            ) : step.title}
          </h1>
          <p className="mt-3.5 text-[14px] leading-[1.5] tracking-[-0.008em]" style={{ color: "rgba(245,236,215,0.6)" }}>
            {step.subtitle}
          </p>

          {/* Options */}
          <div className={cn("mt-5 flex flex-col gap-1.5", step.compact && step.options.length > 6 ? "grid grid-cols-2" : "")}>
            {step.options.map((opt, oi) => {
              const selected =
                step.type === "multi"
                  ? ((answers[step.key] as string[] | undefined) ?? []).includes(opt)
                  : answers[step.key] === opt;
              // Rough value hints
              const deltaHints: Record<string, string> = {
                "Repetitive work": "+€4.2k",
                "Slow customer service": "+€2.8k",
                "Admin & invoicing": "+€2.1k",
                "Content creation": "up to €3.4k",
                "Data silos": "up to €5.0k",
                "Planning & scheduling": "+€1.8k",
                "Research & analysis": "up to €2.6k",
              };
              const deltaHint = deltaHints[opt];
              return (
                <motion.button
                  key={opt}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => step.type === "multi" ? toggleMulti(opt) : pickSingle(opt)}
                  className="relative grid items-center gap-3 overflow-hidden rounded-[14px] px-3.5 py-3.5 text-left transition-all"
                  style={{
                    gridTemplateColumns: "28px 1fr auto",
                    ...(selected ? {
                      background: "linear-gradient(180deg, rgba(201,166,100,0.18), rgba(201,166,100,0.04))",
                      border: "1px solid rgba(201,166,100,0.4)",
                      boxShadow: "inset 0 1px 0 rgba(255,232,168,0.15), 0 0 0 1px rgba(201,166,100,0.1)",
                    } : {
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }),
                  }}
                >
                  {/* Number */}
                  <span
                    className="text-[11px] font-semibold tabular-nums tracking-[0.04em]"
                    style={{ color: selected ? "#E8CB85" : "rgba(245,236,215,0.4)" }}
                  >
                    {String(oi + 1).padStart(2, "0")}
                  </span>

                  {/* Label */}
                  <span className="text-[14.5px] font-medium leading-tight tracking-[-0.012em]" style={{ color: selected ? "#f5ecd7" : "rgba(245,236,215,0.9)" }}>
                    {opt}
                  </span>

                  {/* Right side: delta + checkbox */}
                  <span className="flex items-center gap-2">
                    {deltaHint && (
                      <span
                        className="text-[12px] font-semibold tabular-nums"
                        style={{ color: selected ? "#E8CB85" : "rgba(245,236,215,0.4)" }}
                      >
                        {selected ? (deltaHint.startsWith("+") ? deltaHint : `+${deltaHint.replace("up to ", "")}`) : deltaHint}
                      </span>
                    )}
                    <span
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] transition-all"
                      style={selected ? {
                        background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
                        border: "1.5px solid #C9A664",
                        color: "#14110a",
                        boxShadow: "0 0 12px rgba(201,166,100,0.4)",
                      } : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1.5px solid rgba(245,236,215,0.2)",
                      }}
                    >
                      {selected && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom nav ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pt-3 backdrop-blur-xl"
        style={{
          background: "rgba(8,8,10,0.85)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex w-full max-w-md items-center gap-2 lg:max-w-2xl">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIdx === 0}
            className="flex h-12 w-12 items-center justify-center rounded-[14px] transition disabled:opacity-30"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(245,236,215,0.7)",
            }}
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!isAnswered}
            className={cn(
              "group relative flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] font-semibold text-[15px] transition-all",
              !isAnswered && "opacity-40",
            )}
            style={isAnswered ? {
              background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
              color: "#14110a",
              boxShadow: "0 8px 32px rgba(201,166,100,0.40), inset 0 1px 0 rgba(255,255,255,0.5)",
            } : {
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(245,236,215,0.4)",
            }}
          >
            {stepIdx === total - 1 ? (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Show my number</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  function ValueReveal({
    value,
    low,
    high,
    answers,
  }: {
    value: number;
    low: number;
    high: number;
    answers: Answers;
  }) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 sm:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ValueMeter value={value} progress={1} emphatic label="What you're missing right now · per year" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Realistic range
          </p>
          <p className="mt-0.5 text-base font-medium">
            <span className="text-foreground">{formatEUR(low)}</span>
            <span className="mx-2 text-muted-foreground">–</span>
            <span className="text-foreground">{formatEUR(high)}</span>
          </p>
        </motion.div>

        {/* Blurred AI tools row — credibility signal */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Calculated based on 40+ AI tools
          </p>
          <div className="relative">
            <div
              aria-hidden
              className="flex items-center justify-center gap-2 select-none"
              style={{ filter: "blur(4px)", userSelect: "none" }}
            >
              {[
                { l: "GPT", c: "from-emerald-500 to-teal-600" },
                { l: "Cl", c: "from-orange-500 to-amber-600" },
                { l: "Gem", c: "from-blue-500 to-indigo-600" },
                { l: "Mj", c: "from-slate-600 to-slate-800" },
                { l: "Pp", c: "from-cyan-500 to-sky-600" },
                { l: "n8n", c: "from-pink-500 to-rose-600" },
                { l: "Zp", c: "from-orange-600 to-red-600" },
                { l: "Mk", c: "from-violet-500 to-purple-700" },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.c} text-[10px] font-bold text-white shadow-md`}
                >
                  {t.l}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
          </div>
        </motion.div>

        {/* Quick breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="surface mt-6 px-5 py-4"
        >
          <h3 className="text-sm font-semibold">Where does this come from?</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-foreground/85">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A664]" />
              <span>
                Repetitive hours AI can take over — roughly{" "}
                <strong className="text-foreground">{formatEUR(calc.laborYearly)}</strong> in labor cost per year.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-money" />
              <span>
                Customers/leads you didn't get to — roughly{" "}
                <strong className="text-foreground">{formatEUR(calc.leadsYearly)}</strong> in missed revenue per year.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span>Margin and industry deal value are factored into the estimate.</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA with countdown timer */}
        <UnlockCTA onClick={() => navigate({ to: "/results-loading" })} />

        {/* Blurred report teaser */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">How do you capture this money?</h3>
            <span className="pill">
              <Lock className="h-3 w-3" /> Locked
            </span>
          </div>

          <div
            aria-hidden
            className="select-none space-y-3"
            style={{ filter: "blur(7px)", userSelect: "none" }}
          >
            {[
              "1. Automate customer questions with AI agent → € 18k saved",
              "2. Lead-scoring layer on top of CRM → 27% conversion uplift",
              "3. AI content engine for SEO → +€ 9k/month pipeline",
              "4. Document extraction for invoices → 12 hrs/week freed",
              "5. 90-day roadmap with tools, costs and owners",
            ].map((line, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm"
              >
                {line}
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-card via-card/80 to-transparent pb-6">
            <div className="pointer-events-auto w-full px-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-[#14110a] shadow-[0_0_30px_rgba(201,166,100,0.5)]" style={{ background: "linear-gradient(180deg, #FFE8A8, #C9A664)" }}>
                <Lock className="h-5 w-5" />
              </div>
              <p className="text-sm text-foreground/85">
                The full report shows you <strong className="text-foreground">step by step</strong> how to bring this number in.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What's inside (free) */}
        <div className="mt-6 grid grid-cols-1 gap-2 text-sm">
          {[
            "Concrete AI tools that fit your industry",
            "ROI calculation per quarter",
            "90-day implementation plan",
            "List of quick wins (week 1)",
          ].map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2"
            >
              <Check className="h-4 w-4 text-money" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* hidden ref to avoid unused-var on `answers` */}
        <span className="hidden">{Object.keys(answers).length}</span>
      </div>
    );
  }
}

function UnlockCTA({ onClick }: { onClick: () => void }) {
  const [seconds, setSeconds] = useState(15 * 60);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="mt-5"
    >
      <button
        type="button"
        onClick={onClick}
        className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl font-semibold transition hover:brightness-105"
        style={{ background: "linear-gradient(180deg, #FFE8A8, #C9A664)", color: "#14110a", boxShadow: "0 10px 40px rgba(201,166,100,0.40), inset 0 1px 0 rgba(255,255,255,0.5)" }}
      >
        <Lock className="h-4 w-4" />
        <span className="text-base">Unlock my report</span>
        <span className="flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-mono tabular-nums">
          <Clock className="h-3 w-3" />
          {mm}:{ss}
        </span>
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Price reserved for <span className="font-medium text-foreground/80">{mm}:{ss}</span> · one-time payment · 7-day money back
      </p>
    </motion.div>
  );
}
