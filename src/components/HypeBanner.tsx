import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, TrendingUp, Quote, Zap } from "lucide-react";

type HypeItem =
  | {
      kind: "result";
      person: string;
      role: string;
      avatar: string;
      tool: string;
      toolLogo: string;
      result: string;
    }
  | {
      kind: "quote";
      person: string;
      role: string;
      avatar: string;
      quote: string;
    }
  | {
      kind: "tool";
      tool: string;
      toolLogo: string;
      impact: string;
      detail: string;
    };

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const HYPE_ITEMS: HypeItem[] = [
  {
    kind: "result",
    person: "Mark de Vries",
    role: "Eigenaar logistiek MKB",
    avatar: avatar("Mark de Vries"),
    tool: "ChatGPT",
    toolLogo: favicon("openai.com"),
    result: "€ 92K/jr bespaard in 3 maanden door offertes te automatiseren",
  },
  {
    kind: "quote",
    person: "Sundar Pichai",
    role: "CEO Google",
    avatar: avatar("Sundar Pichai"),
    quote: "AI is more profound than fire or electricity.",
  },
  {
    kind: "tool",
    tool: "Intercom Fin",
    toolLogo: favicon("intercom.com"),
    impact: "72% van support tickets",
    detail: "wordt volledig autonoom afgehandeld bij 1.000+ bedrijven",
  },
  {
    kind: "result",
    person: "Linda Hoekstra",
    role: "Founder e-commerce",
    avatar: avatar("Linda Hoekstra"),
    tool: "Klaviyo AI",
    toolLogo: favicon("klaviyo.com"),
    result: "+40% omzet zonder extra ad-spend in één kwartaal",
  },
  {
    kind: "quote",
    person: "Jensen Huang",
    role: "CEO NVIDIA",
    avatar: avatar("Jensen Huang"),
    quote: "Iedereen is nu een programmeur — je hoeft alleen tegen AI te praten.",
  },
  {
    kind: "tool",
    tool: "Clay",
    toolLogo: favicon("clay.com"),
    impact: "10× meer leads",
    detail: "verrijkt en gepersonaliseerd t.o.v. handmatig prospecten",
  },
  {
    kind: "result",
    person: "Pieter Janssen",
    role: "Adviesbureau",
    avatar: avatar("Pieter Janssen"),
    tool: "n8n",
    toolLogo: favicon("n8n.io"),
    result: "2 FTE administratie vervangen — geen ontslagen, mensen op klantwerk",
  },
  {
    kind: "quote",
    person: "Sam Altman",
    role: "CEO OpenAI",
    avatar: avatar("Sam Altman"),
    quote: "De productiefste mensen zijn al solo-bedrijven van $1M+ met AI.",
  },
];

export function HypeBanner({ index }: { index: number }) {
  const item = HYPE_ITEMS[index % HYPE_ITEMS.length];

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="surface relative overflow-hidden rounded-2xl border border-brand/20 bg-card/60 p-4 backdrop-blur"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(80% 80% at 0% 0%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 60%)",
            }}
          />

          {item.kind === "result" && (
            <div className="flex items-center gap-3">
              <img
                src={item.avatar}
                alt={item.person}
                className="h-11 w-11 flex-none rounded-full border border-border bg-secondary object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/12 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-brand">
                    <TrendingUp className="h-2.5 w-2.5" /> Resultaat
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {item.person} · {item.role}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-snug text-foreground">
                  {item.result}
                </p>
              </div>
              <span
                title={item.tool}
                className="flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-lg border border-border bg-card"
              >
                <img src={item.toolLogo} alt={item.tool} className="h-5 w-5 object-contain" />
              </span>
            </div>
          )}

          {item.kind === "quote" && (
            <div className="flex items-center gap-3">
              <img
                src={item.avatar}
                alt={item.person}
                className="h-11 w-11 flex-none rounded-full border border-border bg-secondary object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/12 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-brand">
                    <Quote className="h-2.5 w-2.5" /> Quote
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {item.person} · {item.role}
                  </span>
                </div>
                <p className="mt-1 text-sm italic leading-snug text-foreground">
                  "{item.quote}"
                </p>
              </div>
            </div>
          )}

          {item.kind === "tool" && (
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                <img src={item.toolLogo} alt={item.tool} className="h-6 w-6 object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/12 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-brand">
                    <Zap className="h-2.5 w-2.5" /> AI Impact
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">{item.tool}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-foreground">
                  <span className="font-semibold text-brand">{item.impact}</span>{" "}
                  <span className="text-foreground/80">{item.detail}</span>
                </p>
              </div>
              <Sparkles className="h-4 w-4 flex-none text-brand" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ReportPreview() {
  const items = [
    { label: "Geschatte jaarwaarde van AI", value: "€ 80K – € 250K" },
    { label: "Top 3 quick wins op maat", value: "Direct toepasbaar" },
    { label: "Aanbevolen tool stack", value: "Met prijzen & links" },
    { label: "90-dagen roadmap", value: "Week voor week" },
  ];
  return (
    <div className="mt-12 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/12">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
        </span>
        <p className="text-sm font-semibold tracking-tight">Wat je straks krijgt</p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-start gap-2 rounded-xl border border-border bg-background/40 px-3 py-2.5"
          >
            <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand/15">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-foreground/90">{it.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {it.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Persoonlijk rapport · klaar binnen 2 minuten · 800+ ondernemers gingen je voor.
      </p>
    </div>
  );
}
