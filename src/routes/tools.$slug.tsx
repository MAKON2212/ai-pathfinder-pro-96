import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Sparkles, Clock, Tag, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { getToolBySlug } from "@/lib/audit";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getToolBySlug(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tool.name} — use it in your business · ScanAI` },
          { name: "description", content: loaderData.tool.description },
          { property: "og:title", content: `${loaderData.tool.name} · ScanAI` },
          { property: "og:description", content: loaderData.tool.useCase },
        ]
      : [{ title: "Tool · ScanAI" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-4xl font-medium tracking-tighter">Tool niet gevonden</h1>
      <p className="mt-3 text-muted-foreground">Deze tool bestaat niet in onze database.</p>
      <Link
        to="/tools"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Terug naar tools
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-3xl font-medium tracking-tighter">Er ging iets mis</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ToolDetailPage,
});

function ToolDetailPage() {
  const { tool } = Route.useLoaderData();
  const detail = tool.detail;

  return (
    <div className="px-6">
      <div className="mx-auto max-w-4xl py-20">
        {/* Back */}
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Alle tools
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
        >
          <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`}
              alt={`${tool.name} logo`}
              className="h-10 w-10 object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">{tool.category}</p>
            <h1 className="mt-1 text-balance text-4xl font-medium tracking-tight md:text-5xl">{tool.name}</h1>
            {detail?.tagline && (
              <p className="mt-3 text-lg text-muted-foreground">{detail.tagline}</p>
            )}
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-none items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Bezoek site <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Meta strip */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {tool.pricing && (
            <MetaCell icon={<Tag className="h-4 w-4" />} label="Indicatieve prijs" value={tool.pricing} />
          )}
          {tool.setupTime && (
            <MetaCell icon={<Clock className="h-4 w-4" />} label="Setup-tijd" value={tool.setupTime} />
          )}
          {detail?.bestFor && (
            <MetaCell icon={<Sparkles className="h-4 w-4" />} label="Best voor" value={detail.bestFor} />
          )}
        </div>

        {/* Description */}
        <section className="mt-16">
          <p className="text-base leading-relaxed text-foreground/90">{tool.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">{tool.useCase}</p>
        </section>

        {/* Use cases */}
        {detail?.useCases?.length ? (
          <section className="mt-16">
            <h2 className="text-2xl font-medium tracking-tight">Use-cases voor jouw bedrijf</h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {detail.useCases.map((u: string) => (
                <li key={u} className="surface flex items-start gap-3 rounded-2xl p-4">
                  <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/10">
                    <Check className="h-3 w-3 text-brand" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-foreground/90">{u}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Before / After */}
        {detail?.beforeAfter?.length ? (
          <section className="mt-20">
            <h2 className="text-2xl font-medium tracking-tight">Voor / na</h2>
            <div className="mt-6 space-y-4">
              {detail.beforeAfter.map((ba: { before: string; after: string }, i: number) => (
                <div key={i} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="surface-2 rounded-2xl p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Voor</p>
                    <p className="mt-2 text-sm text-foreground/80 line-through decoration-muted-foreground/40">
                      {ba.before}
                    </p>
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">Na</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{ba.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Steps */}
        {detail?.steps?.length ? (
          <section className="mt-20">
            <h2 className="text-2xl font-medium tracking-tight">Instapstappen</h2>
            <p className="mt-2 text-sm text-muted-foreground">In deze volgorde — schat 1-3 weken voor de hele lijst.</p>
            <ol className="mt-8 space-y-4">
              {detail.steps.map((s: { title: string; detail?: string }, i: number) => (
                <li key={s.title} className="surface flex gap-4 rounded-2xl p-5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand text-sm font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : tool.firstStep ? (
          <section className="mt-20">
            <h2 className="text-2xl font-medium tracking-tight">Eerste stap</h2>
            <div className="surface mt-6 rounded-2xl p-5">
              <p className="text-sm text-foreground/90">{tool.firstStep}</p>
            </div>
          </section>
        ) : null}

        {/* Not for */}
        {detail?.notFor && (
          <section className="mt-12">
            <div className="surface-2 flex gap-3 rounded-2xl p-5">
              <AlertTriangle className="h-5 w-5 flex-none text-destructive" />
              <div>
                <p className="text-sm font-medium">Wanneer juist niet kiezen</p>
                <p className="mt-1 text-sm text-muted-foreground">{detail.notFor}</p>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-24 rounded-3xl border border-border bg-card p-8 text-center">
          <h2 className="text-balance text-2xl font-medium tracking-tight">
            Wil je weten of {tool.name} bij jouw bedrijf past?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Doe de AI Check en krijg een rapport op maat met deze en andere tools.
          </p>
          <Link
            to="/audit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Start AI Check <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function MetaCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="surface flex items-start gap-3 rounded-2xl p-4">
      <div className="mt-0.5 text-brand">{icon}</div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
