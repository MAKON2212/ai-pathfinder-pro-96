import { motion } from "framer-motion";

const QUESTIONS = [
  { q: "BEDRIJFSNAAM", a: "Acme B.V." },
  { q: "BRANCHE", a: "E-commerce" },
  { q: "GROOTSTE PIJN", a: "Klantenservice" },
];

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const REPORT_LINES = [
  {
    label: "Klantenservice automatisering",
    value: 84000,
    pct: 100,
    tool: { name: "Intercom Fin", logo: favicon("intercom.com") },
  },
  {
    label: "Outbound AI agents",
    value: 62000,
    pct: 74,
    tool: { name: "Clay", logo: favicon("clay.com") },
  },
  {
    label: "Content productie",
    value: 38000,
    pct: 45,
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

const PER_QUESTION = 0.85;
const FORM_VISIBLE = 0.4 + QUESTIONS.length * PER_QUESTION + 0.5;
const SWAP_DELAY = FORM_VISIBLE + 0.2;
const REPORT_HOLD = 4.2;
const TOTAL = SWAP_DELAY + REPORT_HOLD;

const easeExpo = [0.16, 1, 0.3, 1] as const;
const BLUE = "#3B82F6";

// Deterministic particle positions to avoid hydration mismatch
const PARTICLES = Array.from({ length: 26 }).map((_, i) => {
  const seed = i * 37;
  return {
    left: (seed * 13) % 100,
    delay: (seed % 8),
    duration: 8 + ((seed * 3) % 9),
    opacity: 0.1 + ((seed % 20) / 100),
  };
});

function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-px w-px rounded-full bg-white"
          style={{ left: `${p.left}%`, bottom: 0, boxShadow: "0 0 2px rgba(255,255,255,0.6)" }}
        />
      ))}
    </div>
  );
}

function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        opacity: 0.04,
      }}
    />
  );
}

/**
 * Premium dark hero animation — terminal × neural-net × Linear/Palantir.
 * Two-stage: input "AI Check" compiles → output "AI Roadmap" builds.
 */
export function HeroAnimation() {
  return (
    <div
      className="relative mx-auto h-[580px] w-full max-w-[520px] overflow-hidden rounded-[36px]"
      style={{
        background: "#080C14",
      }}
    >
      {/* Radial navy glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(13, 27, 62, 0.85) 0%, transparent 70%)",
        }}
      />
      {/* Diagonal raster lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 14px)",
          opacity: 0.5,
          mixBlendMode: "overlay",
        }}
      />
      {/* Floating particles */}
      <Particles />

      <div className="relative h-full w-full px-5 pt-6">
        {/* INPUT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
          transition={{
            duration: TOTAL,
            times: [0, 0.05, FORM_VISIBLE / TOTAL, (FORM_VISIBLE + 0.5) / TOTAL],
            ease: easeExpo,
          }}
          className="absolute inset-x-5 top-6 overflow-hidden rounded-[24px]"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -40px rgba(0,0,0,0.8)",
          }}
        >
          <GridOverlay />

          {/* Scanner border sweep */}
          <motion.div
            aria-hidden
            initial={{ y: "-100%" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
              boxShadow: `0 0 12px ${BLUE}`,
            }}
          />

          <div className="relative p-6">
            {/* Terminal header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: BLUE, boxShadow: `0 0 8px ${BLUE}` }} />
                <p
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "#F0F4FF", fontFamily: "var(--font-mono)" }}
                >
                  AI_CHECK.run()
                </p>
              </div>
              <span
                className="text-[10px] tabular-nums"
                style={{ color: "#4A5568", fontFamily: "var(--font-mono)" }}
              >
                03 / 15
              </span>
            </div>

            <div className="mt-6 space-y-3.5">
              {QUESTIONS.map((item, i) => (
                <div key={i}>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * PER_QUESTION, duration: 0.25 }}
                    className="text-[9px] tracking-[0.22em]"
                    style={{ color: "#4A5568", fontFamily: "var(--font-mono)" }}
                  >
                    › {item.q}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.55 + i * PER_QUESTION,
                      duration: 0.4,
                      ease: easeExpo,
                    }}
                    className="mt-1.5 flex items-center justify-between rounded-md px-3 py-2"
                    style={{
                      background: "rgba(59, 130, 246, 0.06)",
                      border: "1px solid rgba(59, 130, 246, 0.18)",
                    }}
                  >
                    <span
                      className="text-[12px]"
                      style={{ color: "#F0F4FF", fontFamily: "var(--font-mono)" }}
                    >
                      {item.a}
                    </span>
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + i * PER_QUESTION, duration: 0.25 }}
                      className="text-[10px]"
                      style={{ color: BLUE, fontFamily: "var(--font-mono)" }}
                    >
                      ✓ OK
                    </motion.span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6 flex items-center gap-3">
              <div
                className="h-[2px] flex-1 overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  initial={{ width: "10%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 0.5,
                    duration: PER_QUESTION * QUESTIONS.length,
                    ease: easeExpo,
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: BLUE,
                    boxShadow: `0 0 8px ${BLUE}, 0 0 16px ${BLUE}`,
                  }}
                />
              </div>
              <span
                className="text-[10px] tabular-nums"
                style={{ color: "#4A5568", fontFamily: "var(--font-mono)" }}
              >
                20%
              </span>
            </div>
          </div>
        </motion.div>

        {/* OUTPUT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: SWAP_DELAY, duration: 0.6, ease: easeExpo }}
          className="absolute inset-x-5 top-6 overflow-hidden rounded-[24px]"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -40px rgba(0,0,0,0.8)",
          }}
        >
          <GridOverlay />

          {/* CRT scan flash on entry */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: "-30%" }}
            animate={{ opacity: [0, 0.8, 0], y: ["-30%", "130%"] }}
            transition={{ delay: SWAP_DELAY, duration: 0.9, ease: "linear" }}
            className="pointer-events-none absolute inset-x-0 h-12"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(59,130,246,0.18), transparent)",
            }}
          />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#22C55E", boxShadow: "0 0 8px #22C55E" }}
                />
                <p
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "#F0F4FF", fontFamily: "var(--font-mono)" }}
                >
                  AI_ROADMAP.out
                </p>
              </div>
              <span
                className="rounded px-2 py-0.5 text-[9px] uppercase tracking-[0.18em]"
                style={{
                  color: "#22C55E",
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                READY
              </span>
            </div>

            {/* Estimated value */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: SWAP_DELAY + 0.35, duration: 0.5, ease: easeExpo }}
              className="mt-5 rounded-[16px] p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <p
                  className="text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: "#4A5568", fontFamily: "var(--font-mono)" }}
                >
                  EST. ANNUAL VALUE
                </p>
                <span
                  className="text-[10px]"
                  style={{ color: "#22C55E", fontFamily: "var(--font-mono)" }}
                >
                  ▲ +28%
                </span>
              </div>
              <p
                className="mt-2 text-[44px] font-medium leading-none tracking-tight"
                style={{
                  color: "#F0F4FF",
                  fontFamily: "var(--font-mono)",
                  textShadow: "0 0 24px rgba(59,130,246,0.35)",
                }}
              >
                <CountUp to={184000} delayMs={(SWAP_DELAY + 0.45) * 1000} />
              </p>
              <p
                className="mt-1.5 text-[10px] tracking-[0.14em]"
                style={{ color: "#4A5568", fontFamily: "var(--font-mono)" }}
              >
                PER YEAR · 90 DAY HORIZON
              </p>
            </motion.div>

            {/* Breakdown */}
            <div className="mt-4 space-y-1.5">
              {REPORT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: SWAP_DELAY + 0.7 + i * 0.16,
                    duration: 0.4,
                    ease: easeExpo,
                  }}
                  className="group relative overflow-hidden rounded-md px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* fill bar */}
                  <motion.div
                    aria-hidden
                    initial={{ width: 0 }}
                    animate={{ width: `${line.pct}%` }}
                    transition={{
                      delay: SWAP_DELAY + 0.85 + i * 0.16,
                      duration: 0.7,
                      ease: easeExpo,
                    }}
                    className="absolute inset-y-0 left-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(59,130,246,0.14), rgba(59,130,246,0.02))",
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <img
                          src={line.tool.logo}
                          alt={line.tool.name}
                          loading="lazy"
                          className="h-3.5 w-3.5 object-contain"
                        />
                      </span>
                      <span
                        className="truncate text-[11px]"
                        style={{ color: "#F0F4FF", fontFamily: "var(--font-mono)" }}
                      >
                        {line.label}
                      </span>
                    </div>
                    <span
                      className="text-[11px] tabular-nums"
                      style={{ color: BLUE, fontFamily: "var(--font-mono)" }}
                    >
                      € {(line.value / 1000).toFixed(0)}K
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stack */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: SWAP_DELAY + 1.3, duration: 0.5 }}
              className="mt-5 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between">
                <p
                  className="text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: "#4A5568", fontFamily: "var(--font-mono)" }}
                >
                  STACK · 12 TOOLS
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {TOOL_STACK.map((tool, i) => (
                  <motion.span
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: SWAP_DELAY + 1.4 + i * 0.06,
                      duration: 0.3,
                      ease: easeExpo,
                    }}
                    title={tool.name}
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md transition hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 12px ${BLUE}`;
                      e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
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
                <span
                  className="ml-1 flex h-8 items-center rounded-md px-2 text-[10px]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#4A5568",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  +6
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Animated count-up using framer-motion's animate. */
function CountUp({ to, delayMs }: { to: number; delayMs: number }) {
  return (
    <motion.span
      initial={{ "--n": 0 } as never}
      animate={{ "--n": to } as never}
      transition={{ delay: delayMs / 1000, duration: 1.2, ease: easeExpo }}
    >
      <motion.span>
        {/* Use a child that reads the css var via JS isn't trivial — fallback: simple stagger via key frames */}
      </motion.span>
      <NumberTicker to={to} delayMs={delayMs} />
    </motion.span>
  );
}

function NumberTicker({ to, delayMs }: { to: number; delayMs: number }) {
  // Render via requestAnimationFrame using state
  return <Ticker to={to} delayMs={delayMs} />;
}

import { useEffect, useState } from "react";

function Ticker({ to, delayMs }: { to: number; delayMs: number }) {
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
      // ease-out-expo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delayMs]);
  return <>€ {n.toLocaleString("nl-NL")}</>;
}
