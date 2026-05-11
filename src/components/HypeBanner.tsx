import { AnimatePresence, motion } from "framer-motion";
import huangImg from "@/assets/ceo-huang.png";
import pichaiImg from "@/assets/ceo-pichai.png";
import altmanImg from "@/assets/ceo-altman.png";

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
  pichai: pichaiImg,
  huang: huangImg,
  altman: altmanImg,
  mark: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&h=240&fit=crop&crop=faces",
  linda: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=faces",
  pieter: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&h=240&fit=crop&crop=faces",
};

export const HYPE_ITEMS: HypeItem[] = [
  {
    kind: "tool",
    tool: "ChatGPT",
    toolLogo: favicon("openai.com"),
    headline: "€ 92.000 per jaar bespaard",
    detail: "door offertes en e-mails volledig te automatiseren.",
  },
  {
    kind: "tool",
    tool: "Intercom Fin",
    toolLogo: favicon("intercom.com"),
    headline: "€ 180.000 per jaar bespaard",
    detail: "door 72% van support tickets autonoom af te handelen.",
  },
  {
    kind: "tool",
    tool: "Klaviyo AI",
    toolLogo: favicon("klaviyo.com"),
    headline: "+ € 240.000 extra omzet",
    detail: "in één kwartaal — zonder extra advertentiebudget.",
  },
  {
    kind: "tool",
    tool: "Clay",
    toolLogo: favicon("clay.com"),
    headline: "+ € 500.000 pipeline",
    detail: "via 10× meer verrijkte en gepersonaliseerde leads.",
  },
  {
    kind: "tool",
    tool: "n8n",
    toolLogo: favicon("n8n.io"),
    headline: "€ 120.000 per jaar bespaard",
    detail: "door 2 FTE administratie te vervangen met workflows.",
  },
  {
    kind: "tool",
    tool: "Cursor",
    toolLogo: favicon("cursor.com"),
    headline: "€ 75.000 per jaar bespaard",
    detail: "doordat development teams 2× sneller features shippen.",
  },
  {
    kind: "tool",
    tool: "Lovable",
    toolLogo: favicon("lovable.dev"),
    headline: "€ 60.000 bespaard per project",
    detail: "door MVP's in dagen te bouwen i.p.v. maanden.",
  },
  {
    kind: "tool",
    tool: "Gamma",
    toolLogo: favicon("gamma.app"),
    headline: "€ 25.000 per jaar bespaard",
    detail: "op presentaties, pitches en interne documenten.",
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
    <div className="mb-4 sm:mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          {item.kind === "result" && (
            <figure className="flex items-center gap-3 sm:gap-5">
              <img
                src={item.avatar}
                alt={item.person}
                loading="lazy"
                className="h-9 w-9 flex-none rounded-full object-cover sm:h-16 sm:w-16"
              />
              <div className="min-w-0 flex-1">
                <Label>Resultaat · met {item.tool}</Label>
                <p className="mt-0.5 text-[13px] font-medium leading-snug text-foreground sm:mt-1 sm:text-xl">
                  {item.result}
                </p>
                <figcaption className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1.5 sm:text-sm">
                  {item.person} — {item.role}
                </figcaption>
              </div>
            </figure>
          )}

          {item.kind === "quote" && (
            <figure className="flex items-center gap-3 sm:gap-5">
              <img
                src={item.avatar}
                alt={item.person}
                loading="lazy"
                className="h-9 w-9 flex-none rounded-full object-cover sm:h-16 sm:w-16"
              />
              <div className="min-w-0 flex-1">
                <Label>Over AI</Label>
                <blockquote className="mt-0.5 text-[13px] font-medium leading-snug text-foreground sm:mt-1 sm:text-xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1.5 sm:text-sm">
                  {item.person} — {item.role}
                </figcaption>
              </div>
            </figure>
          )}

          {item.kind === "tool" && (
            <figure className="flex items-center gap-3 sm:gap-5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-border bg-card sm:h-16 sm:w-16">
                <img
                  src={item.toolLogo}
                  alt={item.tool}
                  className="h-5 w-5 object-contain sm:h-8 sm:w-8"
                />
              </span>
              <div className="min-w-0 flex-1">
                <Label>AI-impact · {item.tool}</Label>
                <p className="mt-0.5 font-display text-[13px] font-semibold leading-snug tracking-tight text-foreground sm:mt-1 sm:text-xl">
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

import { TrendingUp, Zap, Wrench, CalendarRange } from "lucide-react";

export function ReportPreview() {
  const items = [
    { Icon: TrendingUp, label: "Geschatte jaarwaarde van AI in jouw bedrijf" },
    { Icon: Zap, label: "Top 3 quick wins, direct toepasbaar" },
    { Icon: Wrench, label: "Aanbevolen tool stack met prijzen & links" },
    { Icon: CalendarRange, label: "90-dagen roadmap, week voor week" },
  ];
  return (
    <section>
      <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
        In jouw rapport
      </span>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:mt-5 sm:text-3xl md:text-[40px]">
        Wat je straks krijgt
      </h2>
      <ul className="mt-4 divide-y divide-border sm:mt-6">
        {items.map(({ Icon, label }) => (
          <li key={label} className="flex items-center gap-4 py-3 sm:py-4">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand/10 text-brand sm:h-11 sm:w-11">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            </span>
            <span className="font-display text-sm font-medium tracking-tight text-foreground sm:text-lg">{label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground sm:mt-6 sm:text-sm">
        Persoonlijk rapport · klaar binnen 2 minuten · 800+ ondernemers gingen je voor.
      </p>
    </section>
  );
}
