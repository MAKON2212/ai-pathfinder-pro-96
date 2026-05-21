import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles, Clock } from "lucide-react";
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

  if (revealed) {
    return <ValueReveal value={calc.total} low={calc.low} high={calc.high} answers={answers} />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-6 sm:pt-10">
      {/* Sticky meter */}
      <div className="sticky top-2 z-30">
        <ValueMeter value={calc.total} progress={(stepIdx + (isAnswered ? 1 : 0)) / total} />
      </div>

      {/* Progress dots */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i < stepIdx
                ? "w-6 bg-white/60"
                : i === stepIdx
                ? "w-8 bg-brand"
                : "w-1.5 bg-white/10",
            )}
          />
        ))}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-8 text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 py-1.5 pl-1.5 pr-4 backdrop-blur-xl">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-[12px] font-medium tracking-tight text-foreground/90">
                Question {stepIdx + 1} of {total}
              </span>
            </div>
          </div>
          <h1
            className="mx-auto max-w-[20ch] text-balance font-display text-[32px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] md:text-[56px]"
            style={{
              background: "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.55) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {step.title}
          </h1>
          <p className="mx-auto mt-4 max-w-[48ch] text-[14px] leading-relaxed text-foreground/65 md:text-[15px]">
            {step.subtitle}
          </p>

          <div
            className={cn(
              "mx-auto mt-8 grid max-w-xl gap-2 text-left",
              step.compact || step.options.length > 6
                ? "grid-cols-2"
                : "grid-cols-1",
            )}
          >

            {step.options.map((opt) => {
              const selected =
                step.type === "multi"
                  ? ((answers[step.key] as string[] | undefined) ?? []).includes(opt)
                  : answers[step.key] === opt;
              return (
                <motion.button
                  key={opt}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    step.type === "multi" ? toggleMulti(opt) : pickSingle(opt)
                  }
                  className={cn(
                    "group relative flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 text-left text-sm transition-all",
                    "hover:border-brand/60 hover:bg-brand/5",
                    selected
                      ? "border-brand bg-brand/15 text-foreground shadow-[0_0_0_1px_var(--brand)]"
                      : "border-border bg-card text-foreground/90",
                  )}
                >
                  <span className="leading-tight">{opt}</span>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-primary-foreground"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 px-4 pt-3 backdrop-blur-md" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIdx === 0}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition disabled:opacity-40"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!isAnswered}
            className={cn(
              "group relative flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl font-semibold transition-all",
              isAnswered
                ? "bg-brand text-primary-foreground shadow-[0_8px_32px_rgba(212,176,98,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] hover:brightness-110 hover:shadow-[0_12px_48px_rgba(212,176,98,0.70)]"
                : "bg-white/5 text-muted-foreground",
            )}
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
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
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
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-[0_0_30px_rgba(212,176,98,0.5)]">
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
        className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand font-semibold text-primary-foreground shadow-[0_10px_40px_rgba(212,176,98,0.45)] transition hover:brightness-110"
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
