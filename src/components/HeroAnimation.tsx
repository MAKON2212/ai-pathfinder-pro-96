import { motion } from "framer-motion";
import { Check, FileText, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";

const QUESTIONS = [
  { q: "Naam van je bedrijf?", a: "Acme B.V." },
  { q: "Branche?", a: "E-commerce" },
  { q: "Grootste pijn?", a: "Klantenservice" },
];

const REPORT_LINES = [
  { label: "Klantenservice automatisering", value: "€ 84K" },
  { label: "Outbound AI agents", value: "€ 62K" },
  { label: "Content productie", value: "€ 38K" },
];

const FILL_DURATION = 0.5;
const PER_QUESTION = 0.95;
const FORM_VISIBLE = 0.3 + QUESTIONS.length * PER_QUESTION + 0.6;
const SWAP_DELAY = FORM_VISIBLE + 0.15;
const REPORT_HOLD = 4.0;
const TOTAL = SWAP_DELAY + REPORT_HOLD;

const calmEase = [0.25, 0.1, 0.25, 1] as const;

/**
 * Refined two-stage hero animation.
 * Calmer motion, premium glass surfaces, no shimmer over the value card.
 */
export function HeroAnimation() {
  return (
    <div className="relative mx-auto h-[540px] w-full max-w-[500px]">
      {/* Soft ambient glow behind cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 45%, color-mix(in oklab, var(--brand) 28%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative h-full w-full">
        {/* QUESTIONNAIRE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: TOTAL,
            times: [0, 0.06, FORM_VISIBLE / TOTAL, (FORM_VISIBLE + 0.5) / TOTAL],
            ease: calmEase,
          }}
          className="absolute inset-x-0 top-0 overflow-hidden rounded-[32px] border border-border/60 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--card) 96%, transparent) 0%, color-mix(in oklab, var(--card) 84%, transparent) 100%)",
          }}
        >
          {/* hairline top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 25%, transparent), transparent)",
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/12">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">AI Check</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Live analyse
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              03 / 15
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {QUESTIONS.map((item, i) => (
              <div key={i}>
                <motion.p
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * PER_QUESTION, duration: 0.3 }}
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {item.q}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + i * PER_QUESTION,
                    duration: FILL_DURATION,
                    ease: easeOutExpo,
                  }}
                  className="mt-2 flex items-center justify-between rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
                >
                  <span className="text-[13px] font-medium text-foreground">{item.a}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.65 + i * PER_QUESTION,
                      duration: 0.35,
                      ease: easeOutExpo,
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-brand"
                  >
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </motion.span>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: "8%" }}
                animate={{ width: "100%" }}
                transition={{
                  delay: 0.4,
                  duration: PER_QUESTION * QUESTIONS.length,
                  ease: easeOutExpo,
                }}
                className="h-full rounded-full bg-brand"
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">20%</span>
          </div>
        </motion.div>

        {/* REPORT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: SWAP_DELAY, duration: 0.65, ease: calmEase }}
          className="absolute inset-x-0 top-0 overflow-hidden rounded-[32px] border border-border/60 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--card) 98%, transparent) 0%, color-mix(in oklab, var(--card) 88%, transparent) 100%)",
          }}
        >
          {/* hairline top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 30%, transparent), transparent)",
            }}
          />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5">
                <FileText className="h-3.5 w-3.5 text-foreground" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">AI Roadmap</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Acme B.V. · 12 pagina's
                </p>
              </div>
            </div>
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: SWAP_DELAY + 0.3, duration: 0.4, ease: easeOutExpo }}
              className="rounded-full bg-brand/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand"
            >
              Klaar
            </motion.span>
          </div>

          {/* Estimated value — clean, no shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SWAP_DELAY + 0.45, duration: 0.55, ease: easeOutExpo }}
            className="mt-6 rounded-2xl border border-border/70 bg-background/40 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Geschatte jaarwaarde
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand">
                <TrendingUp className="h-3 w-3" /> +28%
              </span>
            </div>
            <p className="mt-2 text-[44px] font-medium leading-none tracking-tighter text-foreground">
              € 184.000
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">Per jaar, na 90 dagen</p>
          </motion.div>

          {/* Breakdown lines */}
          <div className="mt-4 space-y-2">
            {REPORT_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: SWAP_DELAY + 0.7 + i * 0.15,
                  duration: 0.45,
                  ease: easeOutExpo,
                }}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <p className="text-[12px] font-medium text-foreground/85">{line.label}</p>
                </div>
                <p className="font-mono text-[12px] tabular-nums text-foreground">{line.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: SWAP_DELAY + 1.2, duration: 0.4 }}
            className="mt-5 flex items-center justify-between border-t border-border/60 pt-4"
          >
            <p className="text-[11px] text-muted-foreground">Volledig rapport · PDF</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
              Bekijken <ArrowUpRight className="h-3 w-3" />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
