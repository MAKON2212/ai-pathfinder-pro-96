import { AnimatePresence, motion } from "framer-motion";

type HypeItem =
  | {
      kind: "result";
      person: string;
      role: string;
      avatar: string;
      tool: string;
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
      headline: string;
      detail: string;
    };

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Real photos – Wikipedia (CEOs) + Unsplash (entrepreneurs, royalty-free)
const PHOTOS = {
  pichai:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sundar_Pichai_WEF_2023_%28cropped%29.jpg/256px-Sundar_Pichai_WEF_2023_%28cropped%29.jpg",
  huang:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Jensen_Huang_-_Web_Summit_Rio_2024_%28cropped%29.jpg/256px-Jensen_Huang_-_Web_Summit_Rio_2024_%28cropped%29.jpg",
  altman:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Sam_Altman_TechCrunch_SF_2019_Day_2_Oct_3_%28cropped%29.jpg/256px-Sam_Altman_TechCrunch_SF_2019_Day_2_Oct_3_%28cropped%29.jpg",
  mark: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&h=240&fit=crop&crop=faces",
  linda: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=faces",
  pieter: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&h=240&fit=crop&crop=faces",
};

export const HYPE_ITEMS: HypeItem[] = [
  {
    kind: "result",
    person: "Mark de Vries",
    role: "Eigenaar logistiek MKB",
    avatar: PHOTOS.mark,
    tool: "ChatGPT",
    result: "€ 92K per jaar bespaard door offertes te automatiseren.",
  },
  {
    kind: "quote",
    person: "Sundar Pichai",
    role: "CEO Google",
    avatar: PHOTOS.pichai,
    quote: "AI is more profound than fire or electricity.",
  },
  {
    kind: "tool",
    tool: "Intercom Fin",
    toolLogo: favicon("intercom.com"),
    headline: "72% van support tickets",
    detail: "wordt volledig autonoom afgehandeld bij 1.000+ bedrijven.",
  },
  {
    kind: "result",
    person: "Linda Hoekstra",
    role: "Founder e-commerce",
    avatar: PHOTOS.linda,
    tool: "Klaviyo AI",
    result: "+40% omzet zonder extra ad-spend in één kwartaal.",
  },
  {
    kind: "quote",
    person: "Jensen Huang",
    role: "CEO NVIDIA",
    avatar: PHOTOS.huang,
    quote: "Iedereen is nu een programmeur — je hoeft alleen tegen AI te praten.",
  },
  {
    kind: "tool",
    tool: "Clay",
    toolLogo: favicon("clay.com"),
    headline: "10× meer leads",
    detail: "verrijkt en gepersonaliseerd t.o.v. handmatig prospecten.",
  },
  {
    kind: "result",
    person: "Pieter Janssen",
    role: "Adviesbureau",
    avatar: PHOTOS.pieter,
    tool: "n8n",
    result: "2 FTE administratie vervangen — mensen nu op klantwerk.",
  },
  {
    kind: "quote",
    person: "Sam Altman",
    role: "CEO OpenAI",
    avatar: PHOTOS.altman,
    quote: "De productiefste mensen zijn al solo-bedrijven van $1M+ met AI.",
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </span>
  );
}

export function HypeBanner({ index }: { index: number }) {
  const item = HYPE_ITEMS[index % HYPE_ITEMS.length];

  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          {item.kind === "result" && (
            <figure className="flex items-center gap-5 border-l-2 border-brand pl-5">
              <img
                src={item.avatar}
                alt={item.person}
                loading="lazy"
                className="h-16 w-16 flex-none rounded-full object-cover grayscale"
              />
              <div className="min-w-0 flex-1">
                <Label>Resultaat · met {item.tool}</Label>
                <p className="mt-1 text-lg font-medium leading-snug text-foreground sm:text-xl">
                  {item.result}
                </p>
                <figcaption className="mt-1.5 text-sm text-muted-foreground">
                  {item.person} — {item.role}
                </figcaption>
              </div>
            </figure>
          )}

          {item.kind === "quote" && (
            <figure className="flex items-center gap-5 border-l-2 border-brand pl-5">
              <img
                src={item.avatar}
                alt={item.person}
                loading="lazy"
                className="h-16 w-16 flex-none rounded-full object-cover grayscale"
              />
              <div className="min-w-0 flex-1">
                <Label>Over AI</Label>
                <blockquote className="mt-1 text-lg font-medium leading-snug text-foreground sm:text-xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-1.5 text-sm text-muted-foreground">
                  {item.person} — {item.role}
                </figcaption>
              </div>
            </figure>
          )}

          {item.kind === "tool" && (
            <figure className="flex items-center gap-5 border-l-2 border-brand pl-5">
              <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-border bg-card">
                <img
                  src={item.toolLogo}
                  alt={item.tool}
                  className="h-8 w-8 object-contain"
                />
              </span>
              <div className="min-w-0 flex-1">
                <Label>AI-impact · {item.tool}</Label>
                <p className="mt-1 text-lg font-medium leading-snug text-foreground sm:text-xl">
                  <span className="text-brand">{item.headline}</span> {item.detail}
                </p>
              </div>
            </figure>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ReportPreview() {
  const items = [
    { n: "01", label: "Geschatte jaarwaarde van AI in jouw bedrijf" },
    { n: "02", label: "Top 3 quick wins, direct toepasbaar" },
    { n: "03", label: "Aanbevolen tool stack met prijzen & links" },
    { n: "04", label: "90-dagen roadmap, week voor week" },
  ];
  return (
    <section className="mt-14 border-t border-border pt-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        In jouw rapport
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        Wat je straks krijgt
      </h2>
      <ul className="mt-6 divide-y divide-border">
        {items.map((it) => (
          <li key={it.n} className="flex items-baseline gap-5 py-4">
            <span className="font-mono text-sm text-brand">{it.n}</span>
            <span className="text-base text-foreground sm:text-lg">{it.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">
        Persoonlijk rapport · klaar binnen 2 minuten · 800+ ondernemers gingen je voor.
      </p>
    </section>
  );
}
