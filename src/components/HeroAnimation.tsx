import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, Sparkles, TrendingUp } from "lucide-react";

const FIELDS = [
  { label: "Bedrijfsnaam", value: "Acme B.V." },
  { label: "Branche", value: "E-commerce" },
  { label: "Grootste pijn", value: "Klantenservice" },
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

// Timing (seconds)
const TYPE_PER_CHAR = 0.045;
const PAUSE_BETWEEN = 0.45;
const START_DELAY = 0.3;

const fieldStart = (i: number) => {
  let t = START_DELAY;
  for (let k = 0; k < i; k++) {
    t += FIELDS[k].value.length * TYPE_PER_CHAR + PAUSE_BETWEEN;
  }
  return t;
};
const FORM_TOTAL =
  fieldStart(FIELDS.length - 1) +
  FIELDS[FIELDS.length - 1].value.length * TYPE_PER_CHAR +
  0.9; // hold after last char

const SWAP_AT = FORM_TOTAL + 0.2;
const REPORT_HOLD = 4.5;

const easeExpo = [0.16, 1, 0.3, 1] as const;
const BLUE = "#0071e3";

export function HeroAnimation() {
  const [phase, setPhase] = useState<"form" | "report">("form");
  useEffect(() => {
    const t = setTimeout(() => setPhase("report"), SWAP_AT * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[340px] md:h-[580px] md:max-w-[520px]">
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
        <AnimatePresence mode="wait">
          {phase === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.985, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: easeExpo }}
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
                      Vraag 3 / 15
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-brand/12 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                  Live
                </span>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: "8%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: FORM_TOTAL, ease: "linear" }}
                    className="h-full rounded-full bg-brand"
                    style={{ boxShadow: `0 0 8px ${BLUE}` }}
                  />
                </div>
              </div>

              {/* Form fields */}
              <div className="mt-6 space-y-4">
                {FIELDS.map((f, i) => (
                  <FormField
                    key={i}
                    label={f.label}
                    value={f.value}
                    startAt={fieldStart(i)}
                    isLast={i === FIELDS.length - 1}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 14, scale: 0.985, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: easeExpo }}
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
                  transition={{ delay: 0.35, duration: 0.4, ease: easeExpo }}
                  className="rounded-full bg-brand/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand"
                >
                  Klaar
                </motion.span>
              </div>

              {/* Estimated value */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: easeExpo }}
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
                  <CountUp to={184000} delayMs={450} />
                </p>
              </motion.div>

              {/* Breakdown */}
              <div className="mt-4 space-y-2">
                {REPORT_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.55 + i * 0.14,
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
                        delay: 0.7 + i * 0.14,
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
                transition={{ delay: 1.05, duration: 0.5, ease: easeExpo }}
                className="mt-5 border-t border-border pt-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Aanbevolen stack
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {TOOL_STACK.map((tool, i) => (
                    <motion.span
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 1.2 + i * 0.06,
                        duration: 0.3,
                        ease: easeExpo,
                      }}
                      title={tool.name}
                      className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border bg-card transition hover:border-brand/40"
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  startAt,
  isLast,
}: {
  label: string;
  value: string;
  startAt: number;
  isLast: boolean;
}) {
  const [typed, setTyped] = useState("");
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startMs = startAt * 1000;
    const focusT = setTimeout(() => setActive(true), startMs);
    const timers: ReturnType<typeof setTimeout>[] = [focusT];
    for (let i = 1; i <= value.length; i++) {
      timers.push(
        setTimeout(() => setTyped(value.slice(0, i)), startMs + i * TYPE_PER_CHAR * 1000),
      );
    }
    timers.push(
      setTimeout(
        () => {
          setDone(true);
          if (!isLast) setActive(false);
        },
        startMs + value.length * TYPE_PER_CHAR * 1000 + 200,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [value, startAt, isLast]);

  return (
    <div>
      <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </label>
      <div
        className={`mt-1.5 flex h-10 items-center rounded-xl border bg-background px-3.5 text-[13px] transition-all ${
          active
            ? "border-brand/60 shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_15%,transparent)]"
            : done
              ? "border-border"
              : "border-border"
        }`}
      >
        <span className="text-foreground/90">{typed}</span>
        {active && !done && (
          <span
            className="ml-px inline-block h-4 w-[1.5px] bg-brand"
            style={{ animation: "blink 1s steps(2) infinite" }}
          />
        )}
        {done && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: easeExpo }}
            viewBox="0 0 24 24"
            className="ml-auto h-4 w-4 text-brand"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
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
