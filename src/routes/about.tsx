import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Over ons · AI Strategy Vault" },
      { name: "description", content: "Wij helpen bedrijven met het ontdekken en implementeren van AI." },
      { property: "og:title", content: "Over ons · AI Strategy Vault" },
      { property: "og:description", content: "Onze missie: AI vertalen naar concrete euro's voor jouw bedrijf." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { n: "01", title: "Praktisch", desc: "Geen hype. Geen theorie. Concrete oplossingen die morgen werken." },
  { n: "02", title: "Snel", desc: "Van audit naar eerste implementatie binnen 30 dagen — geen consultancy-traagheid." },
  { n: "03", title: "Resultaatgericht", desc: "Wij denken in euro's, niet in dashboards. Geen impact = geen factuur." },
];

function AboutPage() {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-5xl py-24">
        <div className="border-b border-border pb-12">
          <span className="pill">· Onze missie</span>
          <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-7xl">
            AI <span className="text-brand">begrijpen</span> is één.<br />
            AI gebruiken is een vak.
          </h1>
          <p className="mt-8 max-w-2xl text-base text-muted-foreground md:text-lg">
            AI Strategy Vault is opgericht om de kloof tussen AI-potentieel en bedrijfsrealiteit
            te dichten. Wij combineren strategie, technologie en design tot een helder pad voorwaarts —
            voor ondernemers die niet willen achterlopen, maar ook niet willen verdwalen in de hype.
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
            Klaar voor jouw <span className="text-brand">AI roadmap</span>?
          </h2>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Start jouw AI Check
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
