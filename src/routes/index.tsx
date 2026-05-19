import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, TrendingUp, Lock, Fingerprint, Briefcase, Building2, Zap, Compass } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-Driven Success, Redefining the Future · ScanAI" },
      {
        name: "description",
        content:
          "Calculate in 90 seconds how much revenue your business is missing each year without AI. Free, instant, personal.",
      },
      { property: "og:title", content: "AI-Driven Success · ScanAI" },
      {
        property: "og:description",
        content: "Next-gen AI studio. See your missed revenue in 90 seconds — free.",
      },
    ],
  }),
  component: Index,
});

function Pill({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 py-1.5 pl-1.5 pr-4 backdrop-blur-xl">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[12px] font-medium tracking-tight text-foreground/90">{children}</span>
    </div>
  );
}

function Index() {
  return (
    <div className="px-4">
      {/* ── HERO ── */}
      <section className="relative mx-auto flex max-w-[1240px] flex-col items-center pb-24 pt-12 text-center md:pt-20">

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-7 max-w-[18ch] text-balance font-display text-[44px] font-medium leading-[1.02] tracking-[-0.035em] text-white sm:text-[68px] md:text-[96px] lg:text-[112px]"
          style={{ background: "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.55) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          AI-Driven Success, Redefining the Future.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-[52ch] text-center text-[15px] leading-relaxed text-foreground/65 md:text-[17px]"
        >
          See in 90 seconds how much revenue your business is missing without AI.
          Free, personal, and instant — no consultant, no fluff.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-white/90"
          >
            Start AI Check
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[14px] font-medium text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            What is ScanAI?
          </Link>
        </motion.div>

        {/* Logo strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid w-full max-w-3xl grid-cols-4 items-center justify-items-center gap-8 opacity-40"
        >
          {["ACME", "IPSUM", "LOOP", "LOGO"].map((l) => (
            <span key={l} className="text-[13px] font-bold tracking-[0.2em] text-white/70">{l}</span>
          ))}
        </motion.div>
      </section>

      {/* ── ABOUT US ── */}
      <section className="mx-auto max-w-[1100px] py-24 text-center">
        <div className="flex justify-center">
          <Pill icon={Fingerprint}>About Us</Pill>
        </div>
        <h2 className="mx-auto mt-6 max-w-[22ch] text-balance font-display text-[34px] font-medium leading-[1.08] tracking-[-0.03em] text-white sm:text-[48px] md:text-[64px]">
          Built on <span className="text-white/55">creativity, collaboration</span>, and <span className="text-white/55">top excellence</span>. ScanAI is a focused team translating AI into euros.
        </h2>
      </section>

      {/* ── STATS ── */}
      <section className="mx-auto max-w-[1240px] py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { v: "€ 47k", l: "Average missed revenue per year" },
            { v: "12 h", l: "Time saved per employee, weekly" },
            { v: "89 %", l: "Discover immediate quick wins" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-xl"
            >
              <div className="font-display text-5xl font-medium tracking-tight text-white md:text-6xl">{s.v}</div>
              <div className="mt-3 text-[13px] text-foreground/60">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-[1240px] py-24">
        <div className="text-center">
          <div className="flex justify-center">
            <Pill icon={Compass}>How It Works</Pill>
          </div>
          <h2 className="mx-auto mt-6 max-w-[20ch] text-balance font-display text-[34px] font-medium leading-[1.08] tracking-[-0.03em] text-white sm:text-[48px] md:text-[56px]">
            Three steps from <span className="text-white/55">questions</span> to <span className="text-white/55">your number</span>.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { n: "01", icon: Clock, t: "Answer 7 questions", d: "Industry, team, margin, time-wasters. No private data. Takes 90 seconds." },
            { n: "02", icon: TrendingUp, t: "See your missed revenue", d: "A live counter shows the euros you leave on the table every year." },
            { n: "03", icon: Lock, t: "Unlock the playbook", d: "Want to know how to capture it? Buy the 90-day plan." },
          ].map(({ n, icon: Icon, t, d }) => (
            <div
              key={t}
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-7 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[11px] text-foreground/40">{n}</span>
              </div>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{t}</h3>
              <p className="mt-2 text-sm text-foreground/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="mx-auto max-w-[1240px] py-24">
        <div className="text-center">
          <div className="flex justify-center">
            <Pill icon={Briefcase}>For Whom</Pill>
          </div>
          <h2 className="mx-auto mt-6 max-w-[22ch] text-balance font-display text-[34px] font-medium leading-[1.08] tracking-[-0.03em] text-white sm:text-[48px] md:text-[56px]">
            Made for <span className="text-white/55">builders</span> who move fast.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Building2, t: "Agencies & studios", d: "Win back billable hours and scale output without hiring." },
            { icon: Briefcase, t: "Service businesses", d: "Convert more leads and trim the operational tax of admin." },
            { icon: Zap, t: "Solo operators", d: "Get the leverage of a team — without the headcount." },
          ].map(({ icon: Icon, t, d }) => (
            <div
              key={t}
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-7 backdrop-blur-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{t}</h3>
              <p className="mt-2 text-sm text-foreground/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="mx-auto max-w-[1100px] py-24 text-center">
        <h2 className="mx-auto max-w-[20ch] text-balance font-display text-[40px] font-medium leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px] md:text-[72px]">
          Ready to see your <span className="text-white/55">number</span>?
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] text-[15px] text-foreground/60 md:text-[17px]">
          Free, no sign-up. Your result loads in 90 seconds.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/90"
          >
            Start AI Check
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
