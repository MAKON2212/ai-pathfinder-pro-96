import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

function Index() {
  return (
    <div className="mx-auto w-full max-w-md px-3 pb-24 sm:max-w-lg sm:px-5">

      {/* ── Eyebrow ── */}
      <motion.div {...fadeUp(0.05)} className="mt-8 flex items-center gap-2">
        <div
          className="inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-[11.5px] font-medium"
          style={{
            background: "rgba(201,166,100,0.08)",
            border: "1px solid rgba(201,166,100,0.3)",
            color: "#f5ecd7",
          }}
        >
          <span
            className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              background: "linear-gradient(135deg, #E8CB85, #876B2C)",
              color: "#0a0805",
              boxShadow: "0 0 12px rgba(201,166,100,0.5)",
            }}
          >
            ✦
          </span>
          AI Revenue Audit · 2026
        </div>
      </motion.div>

      {/* ── Hero ── */}
      <motion.h1
        {...fadeUp(0.12)}
        className="mt-6 font-semibold leading-[0.94] tracking-[-0.045em]"
        style={{ fontSize: "clamp(46px, 12vw, 58px)", color: "#f5ecd7" }}
      >
        What AI{" "}
        <em
          className="not-italic"
          style={{
            background: "linear-gradient(180deg, #FFE8A8 0%, #C9A664 50%, #876B2C 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          costs you
        </em>{" "}
        every year.
      </motion.h1>

      <motion.p
        {...fadeUp(0.18)}
        className="mt-5 max-w-xs text-[15px] leading-[1.5] tracking-[-0.008em]"
        style={{ color: "rgba(245,236,215,0.6)" }}
      >
        A precise measure of the revenue you're leaving on the table.
        Seven questions. Ninety seconds. One number — in gold.
      </motion.p>

      {/* ── Live counter card ── */}
      <motion.div
        {...fadeUp(0.24)}
        className="mt-6 rounded-[20px] p-[18px]"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 60% at 100% 0%, rgba(201,166,100,0.18), transparent 60%)" }}
        />

        {/* Head */}
        <div className="relative flex items-center justify-between">
          <span className="text-[11px] font-medium" style={{ color: "rgba(245,236,215,0.55)" }}>
            Sample · Tech agency 34 FTE
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold"
            style={{
              background: "rgba(201,166,100,0.12)",
              border: "1px solid rgba(201,166,100,0.3)",
              color: "#E8CB85",
            }}
          >
            <span className="live-dot" />
            Live
          </span>
        </div>

        {/* Big value */}
        <div
          className="relative mt-3.5 flex items-baseline gap-1.5 font-semibold tabular-nums leading-none tracking-[-0.04em]"
          style={{
            fontSize: 52,
            background: "linear-gradient(180deg, #FFE8A8 0%, #C9A664 60%, #876B2C 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <span style={{ fontSize: 28 }}>€</span>
          213,480
          <span className="text-[13px] font-medium ml-1.5" style={{ color: "rgba(245,236,215,0.5)", WebkitTextFillColor: "rgba(245,236,215,0.5)" }}>
            / year
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="absolute inset-y-0 left-0 w-[62%] rounded-full"
            style={{
              background: "linear-gradient(90deg, #876B2C, #E8CB85)",
              boxShadow: "0 0 12px rgba(201,166,100,0.6)",
            }}
          />
        </div>

        {/* Foot */}
        <div className="mt-2.5 flex justify-between text-[11px]" style={{ color: "rgba(245,236,215,0.45)" }}>
          <span>Range <b style={{ color: "#E8CB85" }}>€148k – €284k</b></span>
          <span>Confidence <b style={{ color: "#E8CB85" }}>94%</b></span>
        </div>
      </motion.div>

      {/* ── CTAs ── */}
      <motion.div {...fadeUp(0.30)} className="mt-4 flex flex-col gap-2">
        {/* Primary */}
        <Link
          to="/audit"
          className="flex h-14 items-center justify-between rounded-[16px] px-5 text-[15px] font-semibold transition hover:brightness-105"
          style={{
            background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
            color: "#14110a",
            boxShadow: "0 14px 40px rgba(201,166,100,0.30), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(201,166,100,0.4)",
          }}
        >
          <span>Start scan</span>
          <div className="flex items-center gap-2">
            <span
              className="rounded-[8px] px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: "rgba(20,17,10,0.25)", color: "#14110a" }}
            >
              free
            </span>
            <span
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px]"
              style={{ background: "#14110a", color: "#E8CB85" }}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Ghost */}
        <Link
          to="/audit"
          className="flex h-12 items-center justify-between rounded-[16px] px-5 text-[14px] font-medium transition hover:brightness-110"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(245,236,215,0.75)",
          }}
        >
          <span>See sample report</span>
          <span style={{ color: "#E8CB85" }}>↗</span>
        </Link>
      </motion.div>

      {/* ── Trust bar ── */}
      <motion.div {...fadeUp(0.36)} className="mt-5 flex items-center gap-3">
        <div className="flex">
          {[
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/32.jpg",
            "https://randomuser.me/api/portraits/women/68.jpg",
            "https://randomuser.me/api/portraits/men/75.jpg",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-7 w-7 rounded-full border-2 object-cover"
              style={{ marginLeft: i > 0 ? -8 : 0, borderColor: "#08080a", zIndex: 4 - i, position: "relative" }}
            />
          ))}
        </div>
        <div className="text-[13px]" style={{ color: "rgba(245,236,215,0.6)" }}>
          <b style={{ color: "#f5ecd7" }}>2,847</b> scans this month
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10.5px] font-semibold"
          style={{ background: "rgba(201,166,100,0.12)", border: "1px solid rgba(201,166,100,0.25)", color: "#E8CB85" }}
        >
          <span className="live-dot" style={{ width: 5, height: 5 }} />
          Live
        </span>
      </motion.div>

      {/* ── Stats section ── */}
      <motion.div {...fadeUp(0.42)} className="mt-14">
        <div
          className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ background: "rgba(201,166,100,0.08)", border: "1px solid rgba(201,166,100,0.2)", color: "#E8CB85" }}
        >
          The numbers
        </div>
        <h2
          className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.03em]"
          style={{ color: "#f5ecd7" }}
        >
          What your peers{" "}
          <em
            className="not-italic"
            style={{
              background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            already found
          </em>
          .
        </h2>
        <p className="mt-2 text-[13px]" style={{ color: "rgba(245,236,215,0.5)" }}>
          Aggregated across 12,000+ scans by SMBs in NL, BE and DE — last 90 days.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {/* Wide card */}
          <div
            className="col-span-2 rounded-[16px] p-4"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Mini sparkline */}
            <div className="mb-3 flex items-end gap-[3px]" style={{ height: 20 }}>
              {[40,55,45,65,58,72,68].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-[2px]"
                  style={{
                    height: `${h}%`,
                    background: i === 6
                      ? "linear-gradient(180deg, #E8CB85, #C9A664)"
                      : "rgba(201,166,100,0.25)",
                  }}
                />
              ))}
            </div>
            <div
              className="text-[32px] font-semibold leading-none tracking-[-0.04em]"
              style={{
                background: "linear-gradient(180deg, #FFE8A8 0%, #C9A664 60%, #876B2C 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              €213k
            </div>
            <div className="mt-1 text-[12px]" style={{ color: "rgba(245,236,215,0.6)" }}>
              <b style={{ color: "#f5ecd7" }}>Missed revenue / year</b>{" "}
              — average across all scans
            </div>
          </div>

          {[
            { v: "12h", l: "Saved per employee, per week" },
            { v: "89%", l: "Find 3+ quick wins instantly" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-[16px] p-4"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="text-[30px] font-semibold leading-none tracking-[-0.04em]"
                style={{
                  background: "linear-gradient(180deg, #FFE8A8 0%, #C9A664 60%, #876B2C 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.v}
              </div>
              <div className="mt-1.5 text-[12px] leading-snug" style={{ color: "rgba(245,236,215,0.6)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Steps section ── */}
      <motion.div {...fadeUp(0.50)} className="mt-14">
        <div
          className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ background: "rgba(201,166,100,0.08)", border: "1px solid rgba(201,166,100,0.2)", color: "#E8CB85" }}
        >
          The flow
        </div>
        <h2
          className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.03em]"
          style={{ color: "#f5ecd7" }}
        >
          Three steps, one{" "}
          <em
            className="not-italic"
            style={{
              background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            number
          </em>
          .
        </h2>

        <div className="mt-5 space-y-2.5">
          {[
            { n: "01 · INPUT", tag: "90 sec", t: "Answer seven questions", d: "Industry, team size, hourly rate, biggest time-wasters. No private data needed." },
            { n: "02 · CALCULATE", tag: "instant", t: "See your live number", d: "A live meter shows your missed revenue — updating with every answer." },
            { n: "03 · REPORT", tag: "paid", t: "Unlock the full plan", d: "Buy the 90-day roadmap with concrete AI tools, ROI per quarter, and quick wins." },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-[16px] p-4"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: "rgba(245,236,215,0.5)" }}>
                  {s.n}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: "rgba(201,166,100,0.12)", border: "1px solid rgba(201,166,100,0.2)", color: "#E8CB85" }}
                >
                  {s.tag}
                </span>
              </div>
              <div className="text-[15px] font-semibold" style={{ color: "#f5ecd7" }}>{s.t}</div>
              <div className="mt-1 text-[13px] leading-snug" style={{ color: "rgba(245,236,215,0.55)" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Sticky bottom CTA ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center px-4 py-3 md:bottom-6 md:px-0 pointer-events-none">
        <div className="absolute inset-0 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,10,0.80)] backdrop-blur-xl md:hidden" />
        <Link
          to="/audit"
          className="pointer-events-auto relative flex w-full items-center justify-center gap-2 rounded-[16px] px-6 py-3.5 text-[15px] font-semibold transition hover:brightness-105 md:w-auto md:px-10 md:py-4"
          style={{
            background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
            color: "#14110a",
            boxShadow: "0 8px 32px rgba(201,166,100,0.40), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          Calculate my number
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
