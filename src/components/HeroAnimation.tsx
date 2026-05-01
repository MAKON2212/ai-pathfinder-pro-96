import { motion } from "framer-motion";
import { Check, FileText, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";

const QUESTIONS = [
  { q: "Naam van je bedrijf?", a: "Acme B.V." },
  { q: "Branche?", a: "E-commerce" },
  { q: "Grootste pijn?", a: "Klantenservice" },
];

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const REPORT_LINES = [
  {
    label: "Klantenservice automatisering",
    value: "€ 84K",
    tool: { name: "Intercom Fin", logo: favicon("intercom.com") },
  },
  {
    label: "Outbound AI agents",
    value: "€ 62K",
    tool: { name: "Clay", logo: favicon("clay.com") },
  },
  {
    label: "Content productie",
    value: "€ 38K",
    tool: { name: "Jasper", logo: favicon("jasper.ai") },
  },
];

const TOOL_STACK = [
  { name: "ChatGPT", logo: favicon("openai.com") },
  { name: "Claude", logo: favicon("anthropic.com") },
  { name: "Gemini", logo: favicon("gemini.google.com") },
  { name: "n8n", logo: favicon("n8n.io") },
  { name: "Zapier", logo: favicon("zapier.com") },
  { name: "Notion AI", logo: favicon("notion.so") },
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
                     ease: calmEase,
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
                       ease: calmEase,
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
                   ease: calmEase,
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
              transition={{ delay: SWAP_DELAY + 0.3, duration: 0.4, ease: calmEase }}
              className="rounded-full bg-brand/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand"
            >
              Klaar
            </motion.span>
          </div>

          {/* Estimated value — clean, no shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SWAP_DELAY + 0.45, duration: 0.55, ease: calmEase }}
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

          {/* Breakdown lines with tool logos */}
          <div className="mt-4 space-y-2">
            {REPORT_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: SWAP_DELAY + 0.7 + i * 0.15,
                  duration: 0.45,
                  ease: calmEase,
                }}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-background">
                    <img
                      src={line.tool.logo}
                      alt={line.tool.name}
                      loading="lazy"
                      className="h-4 w-4 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-foreground/85">
                      {line.label}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      via {line.tool.name}
                    </p>
                  </div>
                </div>
                <p className="font-mono text-[12px] tabular-nums text-foreground">{line.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Recommended tool stack */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SWAP_DELAY + 1.15, duration: 0.5, ease: calmEase }}
            className="mt-5 border-t border-border/60 pt-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Aanbevolen stack
              </p>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                12 tools
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {TOOL_STACK.map((tool, i) => (
                <motion.span
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: SWAP_DELAY + 1.3 + i * 0.07,
                    duration: 0.35,
                    ease: calmEase,
                  }}
                  title={tool.name}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm"
                >
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    loading="lazy"
                    className="h-4 w-4 object-contain"
                  />
                </motion.span>
              ))}
              <span className="ml-1 flex h-8 items-center rounded-lg border border-border/60 bg-background px-2 font-mono text-[10px] font-medium text-muted-foreground">
                +6
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
