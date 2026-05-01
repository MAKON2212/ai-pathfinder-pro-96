import { motion } from "framer-motion";
import { Check, FileText, Sparkles, TrendingUp } from "lucide-react";

const QUESTIONS = [
  { q: "Naam van je bedrijf?", a: "Acme B.V." },
  { q: "Branche?", a: "E-commerce" },
  { q: "Grootste pijn?", a: "Klantenservice" },
];

const REPORT_LINES = [
  "Acme B.V. laat ~€ 184K per jaar liggen.",
  "Top kans: AI-agent voor klantenservice.",
  "ROI binnen 60 dagen, 25 FTE schaalbaar.",
];

const FILL_DURATION = 0.45;
const PER_QUESTION = 0.9;
const FORM_VISIBLE = 0.3 + QUESTIONS.length * PER_QUESTION + 0.5;
const SWAP_DELAY = FORM_VISIBLE + 0.1;
const REPORT_HOLD = 3.2;
const TOTAL = SWAP_DELAY + REPORT_HOLD;

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

/**
 * Premium two-stage hero animation:
 *  Stage 1: questionnaire fills in with smooth micro-interactions.
 *  Stage 2: form drifts out, report glides in with snippets + value highlight.
 *  Subtle continuous float + glow on container for a polished feel.
 */
export function HeroAnimation() {
  return (
    <div className="relative mx-auto h-[500px] w-full max-w-[480px]">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 0.7, 0.55, 0.7], scale: [0.9, 1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--brand) 35%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Subtle floating wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
      >
        {/* QUESTIONNAIRE */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, 0, 0, -80],
            y: [20, 0, 0, -10],
            scale: [0.96, 1, 1, 0.94],
            rotate: [0, 0, 0, -2],
          }}
          transition={{
            duration: TOTAL,
            times: [0, 0.06, FORM_VISIBLE / TOTAL, (FORM_VISIBLE + 0.4) / TOTAL],
            ease: easeInOutQuart,
          }}
          className="surface absolute inset-x-0 top-0 overflow-hidden rounded-[28px] p-6 shadow-2xl shadow-foreground/10 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--card) 92%, transparent) 0%, color-mix(in oklab, var(--card) 78%, transparent) 100%)",
          }}
        >
          {/* top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand) 60%, transparent), transparent)",
            }}
          />

          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand" />
              </motion.span>
              <span className="text-sm font-semibold tracking-tight">AI Check</span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">03 / 15</span>
          </div>

          <div className="mt-5 space-y-3.5">
            {QUESTIONS.map((item, i) => (
              <div key={i}>
                <motion.p
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * PER_QUESTION, duration: 0.3 }}
                  className="text-[12px] font-medium text-muted-foreground"
                >
                  {item.q}
                </motion.p>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 6 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.45 + i * PER_QUESTION,
                    duration: FILL_DURATION,
                    ease: easeOutExpo,
                  }}
                  className="mt-1.5 flex items-center justify-between rounded-2xl border border-brand/40 px-4 py-2.5"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in oklab, var(--brand) 12%, transparent), color-mix(in oklab, var(--brand) 4%, transparent))",
                  }}
                >
                  <span className="text-[13px] font-medium text-foreground">{item.a}</span>
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.6 + i * PER_QUESTION,
                      duration: 0.35,
                      ease: easeOutExpo,
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-brand shadow-md shadow-brand/30"
                  >
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </motion.span>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary/70">
            <motion.div
              initial={{ width: "8%" }}
              animate={{ width: "100%" }}
              transition={{
                delay: 0.4,
                duration: PER_QUESTION * QUESTIONS.length,
                ease: easeOutExpo,
              }}
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--brand) 70%, transparent), var(--brand))",
              }}
            />
          </div>
        </motion.div>

        {/* REPORT */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.94, rotate: 2 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          transition={{ delay: SWAP_DELAY, duration: 0.85, ease: easeOutExpo }}
          className="surface absolute inset-x-0 top-0 overflow-hidden rounded-[28px] p-6 shadow-2xl shadow-foreground/15 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--card) 95%, transparent) 0%, color-mix(in oklab, var(--card) 82%, transparent) 100%)",
          }}
        >
          {/* top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand) 80%, transparent), transparent)",
            }}
          />

          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand" />
              <span className="text-sm font-semibold tracking-tight">
                Acme B.V. · AI Roadmap.pdf
              </span>
            </div>
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: SWAP_DELAY + 0.3, duration: 0.4, ease: easeOutExpo }}
              className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand"
            >
              Klaar
            </motion.span>
          </div>

          <div className="mt-5 space-y-2.5">
            {REPORT_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{
                  delay: SWAP_DELAY + 0.45 + i * 0.22,
                  duration: 0.5,
                  ease: easeOutExpo,
                }}
                className="flex items-start gap-2 rounded-xl border border-border/50 bg-secondary/40 px-3 py-2"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
                <p className="text-[12px] leading-snug text-foreground/85">{line}</p>
              </motion.div>
            ))}
          </div>

          {/* Estimated value */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: SWAP_DELAY + 1.4, duration: 0.55, ease: easeOutExpo }}
            className="relative mt-5 overflow-hidden rounded-2xl border border-brand/30 p-4"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--brand) 14%, transparent), color-mix(in oklab, var(--brand) 4%, transparent))",
            }}
          >
            {/* shimmer */}
            <motion.div
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{
                delay: SWAP_DELAY + 1.8,
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2.2,
              }}
              className="pointer-events-none absolute inset-y-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklab, var(--brand) 30%, transparent), transparent)",
              }}
            />
            <div className="flex items-center gap-1.5 text-brand">
              <TrendingUp className="h-3 w-3" />
              <p className="text-[10px] font-semibold uppercase tracking-wider">
                Geschatte jaarlijkse waarde
              </p>
            </div>
            <p className="mt-1.5 text-3xl font-semibold tracking-tighter text-foreground">
              € 184.000
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
