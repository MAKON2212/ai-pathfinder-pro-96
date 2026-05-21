import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, TrendingUp, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "How much money are you missing without AI? · ScanAI" },
      {
        name: "description",
        content:
          "Calculate in 90 seconds how much revenue your business is missing each year by not using AI. Free. Personal. Instant result.",
      },
      { property: "og:title", content: "How much money are you missing? · ScanAI" },
      {
        property: "og:description",
        content: "Free calculation in 90 seconds — see your missed revenue before you invest anything.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 pt-4 sm:max-w-lg sm:pt-10">
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-5 text-center text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
      >
        How much money are you missing{" "}
        <span className="gradient-value-text">by not using AI</span>?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-4 text-center text-base text-[rgba(245,236,215,0.6)]"
      >
        Answer 7 short questions and see the number instantly — for free.
        The report on <em>how</em> to capture it, you buy after.
      </motion.p>

      {/* CTA removed — sticky bottom CTA covers this */}

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-10 grid grid-cols-3 gap-2"
      >
        {[
          { v: "€ 47k", l: "average missed / year" },
          { v: "12 h", l: "time saved per employee / week" },
          { v: "89%", l: "find immediate quick wins" },
        ].map((s) => (
          <div
            key={s.l}
            className="surface card-glow flex flex-col items-center px-2 py-3 text-center"
          >
            <div className="gradient-value-text text-lg font-bold sm:text-xl">{s.v}</div>
            <div className="mt-1 text-[10px] leading-tight text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* How it works */}
      <div className="mt-12">
        <h2 className="text-center text-xl font-bold tracking-tight">How does it work?</h2>
        <div className="mt-5 space-y-3">
          {[
            {
              icon: Clock,
              t: "1 · Answer 7 questions",
              d: "Industry, team, margin, time-wasters. No private data. Done in 90 seconds.",
            },
            {
              icon: TrendingUp,
              t: "2 · See your missed revenue",
              d: "A live counting meter shows how much you leave on the table each year.",
            },
            {
              icon: Lock,
              t: "3 · Unlock the report",
              d: "Want to know how to bring that money in? Buy the 90-day plan.",
            },
          ].map(({ icon: Icon, t, d }) => (
            <div
              key={t}
              className="surface card-glow flex items-start gap-3 px-4 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 pb-20 md:pb-0">
        <Link to="/audit" style={{
          background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
          color: "#14110a",
          boxShadow: "0 14px 40px rgba(201,166,100,0.30), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(201,166,100,0.4)",
        }} className="group flex h-14 w-full items-center justify-between rounded-2xl px-5 text-base font-semibold transition hover:brightness-105">
          <span className="flex items-center gap-2"><Sparkles className="h-5 w-5" />Start the free calculation</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl text-[#E8CB85]" style={{ background: "#14110a" }}>
            <ArrowRight className="h-5 w-5" />
          </span>
        </Link>
      </div>

      {/* STICKY BOTTOM CTA — always visible, floating pill on desktop */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center px-4 py-3 md:bottom-6 md:px-0 pointer-events-none">
        <div className="absolute inset-0 border-t border-border bg-background/80 backdrop-blur-xl md:hidden" />
        <Link
          to="/audit"
          className="pointer-events-auto relative flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition hover:brightness-105 md:w-auto md:px-10 md:py-4 md:text-base"
          style={{ background: "linear-gradient(180deg, #FFE8A8, #C9A664)", color: "#14110a", boxShadow: "0 8px 32px rgba(201,166,100,0.40), inset 0 1px 0 rgba(255,255,255,0.5)" }}
        >
          Calculate my number
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
