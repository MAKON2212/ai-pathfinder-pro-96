import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, FileText, Sparkles, TrendingUp } from "lucide-react";

const QUESTIONS = [
  { q: "BEDRIJFSNAAM", a: "Acme B.V." },
  { q: "BRANCHE", a: "E-commerce" },
  { q: "GROOTSTE PIJN", a: "Klantenservice" },
];

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const REPORT_LINES = [
  { label: "Klantenservice automatisering", value: 84000, pct: 100, tool: { name: "Intercom Fin", logo: favicon("intercom.com") } },
  { label: "Outbound AI agents", value: 62000, pct: 74, tool: { name: "Clay", logo: favicon("clay.com") } },
  { label: "Content productie", value: 38000, pct: 45, tool: { name: "Jasper", logo: favicon("jasper.ai") } },
];

const TOOL_STACK = [
  { name: "ChatGPT", logo: favicon("openai.com") },
  { name: "Claude", logo: favicon("anthropic.com") },
  { name: "Gemini", logo: favicon("gemini.google.com") },
  { name: "n8n", logo: favicon("n8n.io") },
  { name: "Zapier", logo: favicon("zapier.com") },
  { name: "Notion AI", logo: favicon("notion.so") },
];

// Timing
const PER_QUESTION = 0.55;
const FORM_HOLD_AFTER = 0.6; // hold filled form before swap
const FORM_VISIBLE = 0.15 + QUESTIONS.length * PER_QUESTION + FORM_HOLD_AFTER;
const SWAP_DELAY = FORM_VISIBLE + 0.25;
const REPORT_HOLD = 4.5;
const TOTAL = SWAP_DELAY + REPORT_HOLD;

const easeExpo = [0.16, 1, 0.3, 1] as const;
const BLUE = "#0071e3";

export function HeroAnimation() {
  const [showInput, setShowInput] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowInput(false), (FORM_VISIBLE + 0.5) * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto h-[580px] w-full max-w-[520px]">
      {/* Soft brand glow behind cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 45%, color-mix(in oklab, var(--brand) 28%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative h-full w-full">
        {/* INPUT CARD — visible immediately, no fade-in */}
        {showInput && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: [1, 1, 0], y: [0, 0, -8] }}
          transition={{
            duration: FORM_VISIBLE + 0.5,
            times: [0, FORM_VISIBLE / (FORM_VISIBLE + 0.5), 1],
            ease: easeExpo,
          }}
          className="absolute inset-x-0 top-0 overflow-hidden rounded-[28px] border border-border bg-card p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.12)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 25%, transparent), transparent)",
            }}
          />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/12">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">AI Check</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Live analyse · 15 vragen
                </p>
              </div>
            </div>
            <span className="rounded-full bg-brand/12 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
              Live
            </span>
          </div>

          {/* Progress accent box — mirrors output's value box */}
          <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Voortgang
              </p>
              <span className="font-mono text-[11px] tabular-nums text-brand">03 / 15</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: "8%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 0.2,
                    duration: PER_QUESTION * QUESTIONS.length,
                    ease: easeExpo,
                  }}
                  className="h-full rounded-full bg-brand"
                  style={{ boxShadow: `0 0 8px ${BLUE}` }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                20%
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {QUESTIONS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + i * PER_QUESTION,
                  duration: 0.35,
                  ease: easeExpo,
                }}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.q}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] font-medium text-foreground/85">
                    {item.a}
                  </p>
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3 + i * PER_QUESTION,
                    duration: 0.25,
                    ease: easeExpo,
                  }}
                  className="ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand"
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        )}

        {/* OUTPUT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: SWAP_DELAY, duration: 0.55, ease: easeExpo }}
          className="absolute inset-x-0 top-0 overflow-hidden rounded-[28px] border border-border bg-card p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.14)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 25%, transparent), transparent)",
            }}
          />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5">
                <FileText className="h-3.5 w-3.5 text-foreground" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">AI Roadmap</p>
              </div>
            </div>
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: SWAP_DELAY + 0.25, duration: 0.4, ease: easeExpo }}
              className="rounded-full bg-brand/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand"
            >
              Klaar
            </motion.span>
          </div>

          {/* Estimated value */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SWAP_DELAY + 0.35, duration: 0.5, ease: easeExpo }}
            className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Geschatte jaarwaarde
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand">
                <TrendingUp className="h-3 w-3" /> +28%
              </span>
            </div>
            <p className="mt-2 text-[44px] font-medium leading-none tracking-tighter text-brand">
              <CountUp to={184000} delayMs={(SWAP_DELAY + 0.45) * 1000} />
            </p>
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">Per jaar, na 90 dagen</p>
          </motion.div>

          {/* Breakdown */}
          <div className="mt-4 space-y-2">
            {REPORT_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: SWAP_DELAY + 0.65 + i * 0.14,
                  duration: 0.4,
                  ease: easeExpo,
                }}
                className="relative overflow-hidden rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5"
              >
                <motion.div
                  aria-hidden
                  initial={{ width: 0 }}
                  animate={{ width: `${line.pct}%` }}
                  transition={{
                    delay: SWAP_DELAY + 0.8 + i * 0.14,
                    duration: 0.7,
                    ease: easeExpo,
                  }}
                  className="absolute inset-y-0 left-0"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklab, var(--brand) 12%, transparent), transparent)",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
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
                  <p className="font-mono text-[12px] font-semibold tabular-nums text-brand">
                    € {(line.value / 1000).toFixed(0)}K
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SWAP_DELAY + 1.15, duration: 0.5, ease: easeExpo }}
            className="mt-5 border-t border-border pt-4"
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
                    delay: SWAP_DELAY + 1.3 + i * 0.06,
                    duration: 0.3,
                    ease: easeExpo,
                  }}
                  title={tool.name}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border bg-card transition hover:border-brand/40"
                  style={{ transition: "box-shadow 0.2s, border-color 0.2s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 14px color-mix(in oklab, ${BLUE} 40%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    loading="lazy"
                    className="h-4 w-4 object-contain"
                  />
                </motion.span>
              ))}
              <span className="ml-1 flex h-8 items-center rounded-lg border border-border bg-card px-2 font-mono text-[10px] font-medium text-muted-foreground">
                +6
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function CountUp({ to, delayMs }: { to: number; delayMs: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now() + delayMs;
    const dur = 1200;
    const tick = (t: number) => {
      if (t < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (t - start) / dur);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delayMs]);
  return <>€ {n.toLocaleString("nl-NL")}</>;
}


