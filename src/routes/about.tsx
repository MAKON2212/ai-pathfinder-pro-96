import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · ScanAI" },
      { name: "description", content: "ScanAI shows entrepreneurs in 3 minutes how much AI delivers to their business each year." },
      { property: "og:title", content: "About · ScanAI" },
      { property: "og:description", content: "Our mission: translate AI into concrete euros for your business." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { n: "01", title: "Practical", desc: "No hype. No theory. Concrete solutions that work tomorrow." },
  { n: "02", title: "Fast", desc: "From audit to first implementation within 30 days — no consultancy drag." },
  { n: "03", title: "Results-driven", desc: "We think in euros, not dashboards. No impact = no invoice." },
];

function AboutPage() {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-5xl py-24">
        <div className="border-b border-border pb-12">
          <span className="pill">· Our mission</span>
          <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-7xl">
            <span className="text-brand">Understanding</span> AI is one thing.<br />
            Using it is a craft.
          </h1>
          <p className="mt-8 max-w-2xl text-base text-muted-foreground md:text-lg">
            ScanAI was founded to bridge the gap between AI potential and business reality.
            We translate 200+ AI tools into one clear value analysis and 90-day roadmap —
            for entrepreneurs who don't want to fall behind, but don't want to get lost in the hype either.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="surface rounded-3xl p-8">
              <div className="font-mono text-[11px] text-brand">{v.n}</div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-border pt-12 md:flex-row md:items-center">
          <h2 className="max-w-md text-3xl font-medium tracking-tighter md:text-4xl">
            Ready for your <span className="text-brand">AI roadmap</span>?
          </h2>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Start your AI Check
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
