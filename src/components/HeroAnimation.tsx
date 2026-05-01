import { motion } from "framer-motion";
import { Check, FileText, TrendingUp } from "lucide-react";

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

const FILL_DURATION = 0.4;
const PER_QUESTION = 0.85;
const FORM_TOTAL_DELAY = 0.3 + QUESTIONS.length * PER_QUESTION + 0.4;
const SWAP_DELAY = FORM_TOTAL_DELAY + 0.15;

/**
 * Two-stage hero animation:
 *  1. Form fades in and questions get answered one by one.
 *  2. Form slides out left, report slides in from right with snippets + value.
 */
export function HeroAnimation() {
  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[460px]">
      {/* QUESTIONNAIRE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: [0, 1, 1, 0],
          x: [0, 0, 0, -60],
          y: [12, 0, 0, 0],
        }}
        transition={{
          duration: SWAP_DELAY + 0.5,
          times: [0, 0.05, FORM_TOTAL_DELAY / (SWAP_DELAY + 0.5), 1],
          ease: "easeInOut",
        }}
        className="surface absolute inset-x-0 top-0 rounded-3xl p-6 shadow-xl shadow-foreground/5"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15">
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-sm font-semibold">AI Check</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">03 / 15</span>
        </div>

        <div className="mt-5 space-y-4">
          {QUESTIONS.map((item, i) => (
            <div key={i}>
              <p className="text-[12px] font-medium text-muted-foreground">{item.q}</p>
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * PER_QUESTION, duration: FILL_DURATION }}
                className="mt-1.5 flex items-center justify-between rounded-2xl border border-brand/40 bg-brand/8 px-4 py-2.5"
              >
                <span className="text-[13px] font-medium text-foreground">{item.a}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.55 + i * PER_QUESTION, duration: 0.25 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-brand"
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </motion.span>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: "10%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: PER_QUESTION * QUESTIONS.length, ease: "easeOut" }}
            className="h-full rounded-full bg-brand"
          />
        </div>
      </motion.div>

      {/* REPORT */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: SWAP_DELAY, duration: 0.6, ease: "easeOut" }}
        className="surface absolute inset-x-0 top-0 rounded-3xl p-6 shadow-xl shadow-foreground/10"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold">Acme B.V. · AI Roadmap.pdf</span>
          </div>
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
            Klaar
          </span>
        </div>

        {/* Report snippets — contextual sentences derived from inputs */}
        <div className="mt-5 space-y-2.5">
          {REPORT_LINES.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: SWAP_DELAY + 0.4 + i * 0.25, duration: 0.4 }}
              className="flex items-start gap-2 rounded-xl bg-secondary/60 px-3 py-2"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
              <p className="text-[12px] leading-snug text-foreground/85">{line}</p>
            </motion.div>
          ))}
        </div>

        {/* Estimated value highlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: SWAP_DELAY + 1.4, duration: 0.4 }}
          className="mt-5 rounded-2xl border border-brand/30 bg-brand/8 p-4"
        >
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
    </div>
  );
}
