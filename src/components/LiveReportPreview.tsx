import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, TrendingUp, Sparkles } from "lucide-react";
import type { AuditAnswers } from "@/lib/audit";

/**
 * Live (volledig geblurde) rapport-preview die meebeweegt met het audit-formulier.
 * Wordt nooit onthuld op deze pagina — pure visuele teaser.
 */

const SAV_BASE: Record<string, number> = {
  "Retail & E-commerce": 48_000,
  "Zakelijke dienstverlening": 62_000,
  "Marketing & Media": 54_000,
  "Productie & Industrie": 78_000,
  "Bouw & Vastgoed": 56_000,
  "Horeca & Toerisme": 38_000,
  "Gezondheidszorg": 70_000,
  "Onderwijs": 32_000,
  "Financieel & Verzekeringen": 92_000,
  "Logistiek & Transport": 64_000,
  "Technologie & Software": 88_000,
  "Non-profit / Overheid": 28_000,
};

function sizeMultiplier(size: string | undefined): number {
  if (!size) return 0;
  const n = Number(size);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n < 5) return 0.6;
  if (n < 15) return 1;
  if (n < 50) return 2.2;
  if (n < 200) return 4.5;
  if (n < 1000) return 9;
  return 18;
}

const TOOLS_BY_INDUSTRY: Record<string, string[]> = {
  "Retail & E-commerce": ["Klaviyo AI", "Shopify Magic", "Octane AI", "Gorgias AI", "Rebuy"],
  "Zakelijke dienstverlening": ["ChatGPT Team", "Clay", "Fathom", "Notion AI", "Lindy"],
  "Marketing & Media": ["Jasper", "Midjourney", "Descript", "Runway", "ElevenLabs"],
  "Productie & Industrie": ["n8n", "Retool", "Augury", "Tulip AI", "Landing AI"],
  "Bouw & Vastgoed": ["Buildots", "OpenSpace", "Document AI", "ChatGPT", "Notion AI"],
  "Horeca & Toerisme": ["Mews AI", "Tablein", "ChatGPT", "Klaviyo", "Sojern"],
  "Gezondheidszorg": ["Nabla", "Suki", "Abridge", "Hippocratic", "Notion AI"],
  "Onderwijs": ["Khanmigo", "MagicSchool", "ChatGPT Edu", "Notion AI", "Gamma"],
  "Financieel & Verzekeringen": ["Hebbia", "Rogo", "Harvey", "ChatGPT Enterprise", "Clay"],
  "Logistiek & Transport": ["Flexport AI", "n8n", "Project44", "ChatGPT", "Retool"],
  "Technologie & Software": ["Cursor", "Lovable", "Linear AI", "Vercel v0", "Anthropic Claude"],
  "Non-profit / Overheid": ["ChatGPT", "Notion AI", "Gamma", "Otter", "Zapier AI"],
};
const DEFAULT_TOOLS = ["ChatGPT", "Claude", "n8n", "Notion AI", "Gamma"];

const ROADMAP_BY_INDUSTRY: Record<string, string[]> = {
  "Retail & E-commerce": [
    "Week 1 · AI-productbeschrijvingen + SEO uitrollen",
    "Week 3 · Klantenservice-agent (72% deflectie)",
    "Week 6 · Predictive flows op winkelwagen-uitval",
    "Week 10 · Personalisatie-engine op homepage",
  ],
  "Zakelijke dienstverlening": [
    "Week 1 · Voorstellen & offertes automatiseren",
    "Week 3 · Lead-enrichment via Clay-pipeline",
    "Week 6 · AI-meeting recap → CRM",
    "Week 10 · Interne knowledge-agent live",
  ],
  "Marketing & Media": [
    "Week 1 · Content-engine met merk-tone",
    "Week 3 · Visuele assets via Midjourney/Runway",
    "Week 6 · Multi-channel scheduler met AI-copy",
    "Week 10 · Performance-rapporten automatiseren",
  ],
  "Productie & Industrie": [
    "Week 1 · Inkoop & voorraad-agent",
    "Week 3 · Predictive maintenance pilot",
    "Week 6 · Vision-QA op productielijn",
    "Week 10 · OEE-dashboard met AI-insights",
  ],
};
const DEFAULT_ROADMAP = [
  "Week 1 · Quick wins inventariseren + 2 agents live",
  "Week 3 · Workflow-automatisering op admin",
  "Week 6 · Sales- & service-AI activeren",
  "Week 10 · Roadmap-review + opschalen",
];

function useAnimatedNumber(value: number) {
  const [d, setD] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current;
    const delta = value - start;
    if (delta === 0) return;
    const dur = 900;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setD(Math.round(start + delta * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return d;
}

function countAnswered(a: Partial<AuditAnswers>): number {
  let n = 0;
  if (a.industry) n++;
  if (a.size && Number(a.size) > 0) n++;
  if (a.painPoints && a.painPoints.length > 0) n++;
  if (a.goals && a.goals.length > 0) n++;
  return n;
}

export function LiveReportPreview({
  answers,
  pulseKey,
}: {
  answers: Partial<AuditAnswers>;
  pulseKey: number;
}) {
  const industry = answers.industry || "";
  const base = SAV_BASE[industry] ?? 0;
  const mult = sizeMultiplier(answers.size);
  const savings = Math.round(base * mult);
  const roi = savings > 0 ? Math.round(savings / 29) : 0;

  const tools = useMemo(
    () => TOOLS_BY_INDUSTRY[industry] || DEFAULT_TOOLS,
    [industry],
  );
  const roadmap = useMemo(
    () => ROADMAP_BY_INDUSTRY[industry] || DEFAULT_ROADMAP,
    [industry],
  );

  const answered = countAnswered(answers);

  // Progress-bars variëren op basis van antwoorden.
  const painSet = new Set(answers.painPoints ?? []);
  const goalSet = new Set(answers.goals ?? []);
  const admin = clamp(
    25 +
      (painSet.has("Repetitief handwerk") ? 35 : 0) +
      (painSet.has("Administratie & facturatie") ? 25 : 0) +
      (mult > 2 ? 10 : 0),
  );
  const support = clamp(
    20 +
      (painSet.has("Trage klantenservice") ? 45 : 0) +
      (goalSet.has("Klanttevredenheid verhogen") ? 20 : 0) +
      (industry === "Retail & E-commerce" ? 10 : 0),
  );
  const sales = clamp(
    20 +
      (goalSet.has("Omzet verhogen") ? 35 : 0) +
      (painSet.has("Lead generatie") ? 25 : 0) +
      (answers.conversionRate ? 15 : 0),
  );

  const dispSavings = useAnimatedNumber(savings);
  const dispRoi = useAnimatedNumber(roi);

  return (
    <section className="surface relative overflow-hidden p-4 sm:p-6 md:p-7">
      {/* Geblurde inhoud */}
      <div className="relative">
        <motion.div
          key={`${industry}-${answers.size}-${(answers.painPoints ?? []).join(",")}-${(answers.goals ?? []).join(",")}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          aria-hidden
          className="pointer-events-none select-none"
          style={{ filter: "blur(7px)" }}
        >
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Jaarlijkse besparing
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-brand tabular-nums">
                € {dispSavings.toLocaleString("nl-NL")}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3" />
                op basis van branche & team
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Verwachte ROI
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {dispRoi.toLocaleString("nl-NL")}×
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                <Sparkles className="mr-1 inline h-3 w-3" />
                rendement op investering
              </p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-5 space-y-3">
            {[
              { label: "Admin", val: admin },
              { label: "Klantencontact", val: support },
              { label: "Sales", val: sales },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.val}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{
                      width: `${row.val}%`,
                      transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tool chips */}
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Aanbevolen tools
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <AnimatePresence mode="popLayout">
                {tools.map((tool, i) => (
                  <motion.span
                    key={`${industry}-${tool}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, delay: i * 0.07 }}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {tool}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Roadmap */}
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              90-dagen roadmap
            </p>
            <ul className="mt-2 space-y-2">
              <AnimatePresence mode="popLayout">
                {roadmap.map((row, i) => (
                  <motion.li
                    key={`${industry}-${row}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                    {row}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* Spinner overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <AnimatePresence>
              <motion.span
                key={pulseKey}
                initial={{ opacity: 0.7, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-brand"
              />
            </AnimatePresence>
            <span className="absolute inset-0 rounded-full bg-background/60 backdrop-blur-sm" />
            <Loader2 className="relative h-9 w-9 animate-spin text-brand" strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Je rapport wordt live opgebouwd terwijl je antwoordt.
      </p>
    </section>
  );
}

function clamp(n: number) {
  return Math.max(5, Math.min(95, Math.round(n)));
}
