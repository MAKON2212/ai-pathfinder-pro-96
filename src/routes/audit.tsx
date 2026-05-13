import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LiveReportPreview } from "@/components/LiveReportPreview";
import { HypeBanner } from "@/components/HypeBanner";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import {
  INDUSTRIES,
  
  REVENUES,
  TIMELINES,
  TECH_STACK,
  PAIN_POINTS,
  GOALS,
  BUDGETS,
  CUSTOMER_VALUES,
  CUSTOMERS_PER_YEAR,
  GROSS_MARGINS,
  HOURLY_COSTS,
  CHURN_RATES,
  CS_VOLUMES,
  CS_CHANNELS,
  REPETITIVE_HOURS,
  INVOICE_VOLUMES,
  CONTENT_VOLUMES,
  LEAD_VOLUMES,
  CONVERSION_RATES,
  SALES_CYCLES,
  PRIMARY_CHANNELS,
  ECOMMERCE_PLATFORMS,
  SERVICE_MODELS,
  MANUFACTURING_TYPES,
  type AuditAnswers,
} from "@/lib/audit";
import { cn } from "@/lib/utils";
import { trackAuditSession } from "@/lib/audit-tracking.functions";


export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "AI Check · ScanAI" },
      { name: "description", content: "Vul de AI Check in en ontdek hoeveel AI jouw bedrijf oplevert." },
      { property: "og:title", content: "AI Check · ScanAI" },
      { property: "og:description", content: "Beantwoord een paar vragen en ontvang je persoonlijke AI roadmap." },
    ],
  }),
  component: AuditPage,
});

type Step =
  | { key: keyof AuditAnswers; title: string; type: "single"; options: string[]; allowOther?: boolean; subtitle?: string }
  | { key: keyof AuditAnswers; title: string; type: "multi"; options: string[]; allowOther?: boolean; subtitle?: string }
  | { key: keyof AuditAnswers; title: string; type: "text"; placeholder: string; inputType?: string; required?: boolean; subtitle?: string }
  | { key: keyof AuditAnswers; title: string; type: "longtext"; placeholder: string; minLength?: number; subtitle?: string };

const BASE_STEPS: Step[] = [
  { key: "companyName", title: "Wat is de naam van je bedrijf?", type: "text", placeholder: "Bijv. Acme B.V.", required: true, subtitle: "Het rapport wordt persoonlijk gemaakt op basis van deze naam." },
  { key: "website", title: "Wat is jullie website?", type: "text", placeholder: "https://jouwbedrijf.nl", inputType: "url", subtitle: "Optioneel — we analyseren meerdere pagina's om het rapport te verrijken." },
  { key: "linkedin", title: "Wat is jullie LinkedIn-pagina?", type: "text", placeholder: "https://linkedin.com/company/...", inputType: "url", subtitle: "Optioneel — helpt om context te verrijken." },
  { key: "socials", title: "Andere socials of bronnen?", type: "text", placeholder: "Instagram, X, blog, etc.", subtitle: "Optioneel — sla over als je niets wilt delen." },
  { key: "industry", title: "In welke branche werk je?", type: "single", options: INDUSTRIES, allowOther: true },
  { key: "size", title: "Hoeveel mensen werken er bij jullie?", type: "text", inputType: "number", required: true, placeholder: "Bijv. 14", subtitle: "Vul het exacte aantal medewerkers in (FTE of headcount). Hoe nauwkeuriger, hoe beter het rapport." },
  { key: "revenue", title: "Wat is jullie jaaromzet?", type: "single", options: REVENUES },
  { key: "grossMargin", title: "Wat is jullie indicatieve bruto marge?", type: "single", options: GROSS_MARGINS, subtitle: "Bepaalt hoe hard omzet-uplift doorrekent op je winst." },
  { key: "avgHourlyCost", title: "Gemiddeld uurloon (incl. werkgeverslasten)?", type: "single", options: HOURLY_COSTS, subtitle: "Voor een eerlijke loonbesparing-rekensom." },
  { key: "churnRate", title: "Wat is jullie jaarlijkse klant-churn?", type: "single", options: CHURN_RATES, subtitle: "Hoeveel klanten verlies je per jaar — schat gerust." },
  { key: "customerValue", title: "Wat brengt een gemiddelde klant op per jaar?", type: "single", options: CUSTOMER_VALUES, subtitle: "Gebruik je beste schatting van de gemiddelde Customer Lifetime Value per jaar." },
  { key: "customersPerYear", title: "Hoeveel klanten bedienen jullie per jaar?", type: "single", options: CUSTOMERS_PER_YEAR },
  { key: "techStack", title: "Welke tools gebruiken jullie nu?", type: "multi", options: TECH_STACK, allowOther: true },
  { key: "painPoints", title: "Wat zijn jullie grootste uitdagingen?", type: "multi", options: PAIN_POINTS, allowOther: true },
  { key: "goals", title: "Welke doelen wil je behalen met AI?", type: "multi", options: GOALS, allowOther: true },
  { key: "budget", title: "Wat is je indicatieve AI-budget?", type: "single", options: BUDGETS },
  { key: "timeline", title: "Op welke termijn wil je starten?", type: "single", options: TIMELINES },
  { key: "outcome", title: "Wat wil je concreet uit deze strategie halen?", type: "longtext", placeholder: "Bijvoorbeeld: ik wil weten welke 3 AI tools ik direct kan inzetten om € 50K per jaar te besparen op klantenservice…" },
];

// Conditional follow-up steps. Inserted right after the trigger step.
function buildSteps(a: AuditAnswers): Step[] {
  const steps: Step[] = [...BASE_STEPS];
  const insertAfter = (key: keyof AuditAnswers, ...extra: Step[]) => {
    const idx = steps.findIndex((s) => s.key === key);
    if (idx === -1) return;
    steps.splice(idx + 1, 0, ...extra);
  };

  // Branche-specifieke vragen direct na "industry"
  if (a.industry === "Retail & E-commerce") {
    insertAfter("industry", { key: "ecommercePlatform", title: "Welk e-commerce platform gebruiken jullie?", type: "single", options: ECOMMERCE_PLATFORMS, allowOther: true });
  } else if (a.industry === "Zakelijke dienstverlening" || a.industry === "Marketing & Media") {
    insertAfter("industry", { key: "serviceModel", title: "Welk dienstverleningsmodel hanteren jullie?", type: "single", options: SERVICE_MODELS });
  } else if (a.industry === "Productie & Industrie") {
    insertAfter("industry", { key: "manufacturingType", title: "Welk productietype past het beste?", type: "single", options: MANUFACTURING_TYPES });
  }

  // Vervolgvragen per pijnpunt — direct na painPoints
  const painFollowUps: Step[] = [];
  if (a.painPoints.includes("Trage klantenservice")) {
    painFollowUps.push(
      { key: "customerServiceVolume", title: "Hoeveel klantvragen krijgen jullie per week?", type: "single", options: CS_VOLUMES, subtitle: "Telefoon, mail en chat opgeteld." },
      { key: "customerServiceChannels", title: "Via welke kanalen komen die binnen?", type: "multi", options: CS_CHANNELS },
    );
  }
  if (a.painPoints.includes("Repetitief handwerk")) {
    painFollowUps.push({ key: "repetitiveHoursPerWeek", title: "Hoeveel uur per week gaat op aan repetitief werk?", type: "single", options: REPETITIVE_HOURS, subtitle: "Tel het hele team op." });
  }
  if (a.painPoints.includes("Administratie & facturatie")) {
    painFollowUps.push({ key: "invoicesPerMonth", title: "Hoeveel facturen / bonnetjes verwerken jullie per maand?", type: "single", options: INVOICE_VOLUMES });
  }
  if (a.painPoints.includes("Content creatie kost te veel tijd")) {
    painFollowUps.push({ key: "contentPiecesPerMonth", title: "Hoeveel content-pieces produceren jullie per maand?", type: "single", options: CONTENT_VOLUMES, subtitle: "Posts, video's, blogs samen." });
  }
  if (a.painPoints.includes("Lead generatie")) {
    painFollowUps.push(
      { key: "leadsPerMonth", title: "Hoeveel leads krijgen jullie nu per maand?", type: "single", options: LEAD_VOLUMES },
      { key: "conversionRate", title: "Wat is jullie huidige lead-naar-klant conversie?", type: "single", options: CONVERSION_RATES },
    );
  }
  if (painFollowUps.length) insertAfter("painPoints", ...painFollowUps);

  // Vervolgvragen per doel — direct na goals
  const goalFollowUps: Step[] = [];
  if (a.goals.includes("Omzet verhogen")) {
    goalFollowUps.push(
      { key: "salesCycleLength", title: "Hoe lang is jullie gemiddelde sales-cyclus?", type: "single", options: SALES_CYCLES },
      { key: "primaryChannel", title: "Wat is jullie belangrijkste acquisitie-kanaal?", type: "single", options: PRIMARY_CHANNELS },
    );
  }
  if (goalFollowUps.length) insertAfter("goals", ...goalFollowUps);

  return steps;
}

const OTHER = "Anders, namelijk…";

/** Lichte URL-validatie: accepteert met of zonder protocol. */
function isValidUrl(raw: string): boolean {
  const v = raw.trim();
  if (!v) return false;
  // Voeg protocol toe als gebruiker het vergat — voorkomt over-strict afkeuren.
  const candidate = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(candidate);
    // Domein moet een punt bevatten en geen spaties.
    return u.hostname.includes(".") && !/\s/.test(u.hostname);
  } catch {
    return false;
  }
}

function detectDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  const w = window.innerWidth;
  const isTabletUA = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua);
  const isMobileUA = /Mobi|iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isTabletUA || (w >= 768 && w < 1024 && /Touch|Android|iPad/i.test(ua))) return "tablet";
  if (isMobileUA || w < 768) return "mobile";
  return "desktop";
}

function AuditPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AuditAnswers>({
    companyName: "",
    industry: "",
    size: "",
    revenue: "",
    techStack: [],
    painPoints: [],
    goals: [],
    budget: "",
    outcome: "",
    timeline: "",
    website: "",
    linkedin: "",
    socials: "",
    customerValue: "",
    customersPerYear: "",
  });
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [otherActive, setOtherActive] = useState<Record<string, boolean>>({});
  /** Toon foutmelding alleen nadat de gebruiker een poging heeft gedaan (blur of Volgende-klik). */
  const [showError, setShowError] = useState<Record<string, boolean>>({});

  const steps = buildSteps(answers);
  const safeStep = Math.min(step, steps.length - 1);
  const current = steps[safeStep];
  const value = answers[current.key] as string | string[] | undefined;
  const otherKey = String(current.key);
  const isOtherActive = otherActive[otherKey] || false;
  const otherVal = otherText[otherKey] || "";

  /**
   * Geeft een specifieke validatie-fout per stap terug, of null als geldig.
   * Een aparte functie zodat we ook de reden kunnen tonen onder het veld.
   */
  function validateCurrent(): string | null {
    if (current.type === "text") {
      const v = typeof value === "string" ? value.trim() : "";
      if (!current.required) {
        // Optioneel veld — als leeg = OK. Als ingevuld + URL → wel valideren.
        if (v.length === 0) return null;
        if (current.inputType === "url" && !isValidUrl(v)) {
          return "Vul een geldige URL in (bv. https://voorbeeld.nl) of laat leeg.";
        }
        return null;
      }
      // Verplicht
      if (v.length === 0) return "Vul dit veld in om verder te gaan.";
      if (current.inputType === "number") {
        const n = Number(v);
        if (!Number.isFinite(n) || n < 1) return "Vul een geldig aantal medewerkers in (minimaal 1).";
        if (n > 100000) return "Dat lijkt te hoog — vul een realistisch aantal in.";
        return null;
      }
      if (v.length < 2) return "Te kort — vul minimaal 2 tekens in.";
      if (current.inputType === "url" && !isValidUrl(v)) {
        return "Vul een geldige URL in, bijvoorbeeld https://jouwbedrijf.nl";
      }
      return null;
    }
    if (current.type === "longtext") {
      const len = typeof value === "string" ? value.trim().length : 0;
      if (len === 0) return "Schrijf in eigen woorden wat je wilt bereiken.";
      if (len < 20) return `Nog ${20 - len} tekens nodig — wees iets specifieker.`;
      return null;
    }
    if (isOtherActive) {
      if (otherVal.trim().length === 0) return "Vul je eigen antwoord in onder 'Anders'.";
      if (otherVal.trim().length < 4) return "Te kort — minimaal 4 tekens.";
      return null;
    }
    if (current.type === "single") {
      return typeof value === "string" && value.length > 0 ? null : "Kies één optie om verder te gaan.";
    }
    // multi
    return Array.isArray(value) && value.length > 0
      ? null
      : "Selecteer minstens één optie (of voeg er één toe via 'Anders').";
  }

  const errorMsg = validateCurrent();
  const isValid = errorMsg === null;
  const errorVisible = !!showError[otherKey] && !isValid;

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // Bij stap-wissel: verberg foutmelding van de NIEUWE stap (gebruiker heeft nog niets geprobeerd).
  useEffect(() => {
    setShowError((prev) => ({ ...prev, [otherKey]: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeStep]);

  // ── Sessie tracking ─────────────────────────────────────────────
  const sessionKeyRef = useRef<string>("");
  const maxStepRef = useRef<number>(0);
  if (typeof window !== "undefined" && !sessionKeyRef.current) {
    let k = sessionStorage.getItem("audit_session_key");
    if (!k) {
      k = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("audit_session_key", k);
    }
    sessionKeyRef.current = k;
  }

  // Debounced upsert bij elke stap-wissel.
  useEffect(() => {
    if (typeof window === "undefined" || !sessionKeyRef.current) return;
    if (safeStep > maxStepRef.current) maxStepRef.current = safeStep;
    const t = setTimeout(() => {
      trackAuditSession({
        data: {
          sessionKey: sessionKeyRef.current,
          currentStep: safeStep,
          maxStepReached: maxStepRef.current,
          totalSteps: steps.length,
          lastStepKey: String(current.key),
          company: typeof answers.companyName === "string" ? answers.companyName : undefined,
          industry: typeof answers.industry === "string" ? answers.industry : undefined,
          teamSize: typeof answers.size === "string" ? answers.size : undefined,
          answers: answers as unknown as Record<string, unknown>,
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined,
          landingPath: window.location.pathname,
          deviceType: detectDeviceType(),
        },
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeStep]);

  const finalize = (finalAnswers: AuditAnswers) => {
    sessionStorage.setItem("audit_answers", JSON.stringify(finalAnswers));
    if (sessionKeyRef.current) {
      trackAuditSession({
        data: {
          sessionKey: sessionKeyRef.current,
          currentStep: steps.length,
          maxStepReached: steps.length,
          totalSteps: steps.length,
          lastStepKey: String(current.key),
          company: typeof finalAnswers.companyName === "string" ? finalAnswers.companyName : undefined,
          industry: typeof finalAnswers.industry === "string" ? finalAnswers.industry : undefined,
          teamSize: typeof finalAnswers.size === "string" ? finalAnswers.size : undefined,
          answers: finalAnswers as unknown as Record<string, unknown>,
          completed: true,
        },
      }).catch(() => {});
    }
    navigate({ to: "/results-loading" });
  };

  const goNext = () => {
    if (!isValid) {
      // Forceer foutmelding zichtbaar op deze stap.
      setShowError({ ...showError, [otherKey]: true });
      return;
    }
    let finalAnswers = answers;
    if (isOtherActive && otherVal.trim().length >= 4) {
      if (current.type === "single") {
        finalAnswers = { ...answers, [current.key]: otherVal.trim() };
      } else if (current.type === "multi") {
        const arr = ((answers[current.key] as string[] | undefined) || []).filter((x) => x !== OTHER);
        finalAnswers = { ...answers, [current.key]: [...arr, otherVal.trim()] };
      }
      setAnswers(finalAnswers);
    }
    if (safeStep < steps.length - 1) {
      setStep(step + 1);
    } else {
      finalize(finalAnswers);
    }
  };

  const handleSelect = (opt: string) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    if (current.type === "single") {
      if (opt === OTHER) {
        setOtherActive({ ...otherActive, [otherKey]: true });
        setAnswers({ ...answers, [current.key]: "" });
        return;
      }
      setOtherActive({ ...otherActive, [otherKey]: false });
      setShowError({ ...showError, [otherKey]: false });
      const updated = { ...answers, [current.key]: opt };
      setAnswers(updated);
      advanceTimer.current = setTimeout(() => {
        const nextSteps = buildSteps(updated);
        if (safeStep >= nextSteps.length - 1) {
          finalize(updated);
        } else {
          setStep((s) => Math.min(nextSteps.length - 1, s + 1));
        }
      }, 180);
    } else if (current.type === "multi") {
      if (opt === OTHER) {
        setOtherActive({ ...otherActive, [otherKey]: !isOtherActive });
        return;
      }
      const arr = (answers[current.key] as string[] | undefined) || [];
      const next = arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt];
      setAnswers({ ...answers, [current.key]: next });
      // Verberg fout direct na een geldige selectie.
      if (next.length > 0) setShowError({ ...showError, [otherKey]: false });
    }
  };

  const goBack = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStep(Math.max(0, safeStep - 1));
  };

  const isSelected = (opt: string) => {
    if (opt === OTHER) return isOtherActive;
    if (current.type === "single") return value === opt;
    return Array.isArray(value) && value.includes(opt);
  };

  const progress = ((safeStep + 1) / steps.length) * 100;
  const stepLabel = String(safeStep + 1).padStart(2, "0");
  const totalLabel = String(steps.length).padStart(2, "0");

  const subtitleDefault = current.type === "multi"
    ? "Selecteer alles wat van toepassing is."
    : current.type === "text"
      ? (current.required ? "Vul je antwoord in." : "Optioneel — sla over als je wil.")
      : current.type === "longtext"
        ? "Schrijf in je eigen woorden — minimaal 20 tekens."
        : "Klik om te kiezen — je gaat automatisch verder.";
  const subtitle = "subtitle" in current && current.subtitle ? current.subtitle : subtitleDefault;


  return (
    <div className="px-4 sm:px-5 md:px-6">
      {/* Top thin progress bar — sits flush under the navbar */}
      <div className="fixed left-0 right-0 top-[64px] z-30 h-[3px] bg-transparent">
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-brand"
        />
      </div>

      <div className="mx-auto max-w-2xl pt-5 pb-24 sm:pt-10 sm:pb-40 md:max-w-6xl md:pt-16 md:pb-32">
        <div className="mb-5 sm:mb-8 md:mb-10">
          <HypeBanner index={safeStep} />
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 md:items-start">
          <div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="surface px-4 py-5 sm:px-7 sm:py-7 md:px-12 md:py-9"
          >
            <h2 className="text-balance text-2xl font-semibold leading-[1.15] tracking-tight sm:text-3xl md:text-[40px]">
              {current.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 md:text-base">{subtitle}</p>

            {current.type === "text" ? (
              <div className="mt-4 sm:mt-6 md:mt-10">
                <input
                  type={current.inputType || "text"}
                  autoFocus
                  value={typeof value === "string" ? value : ""}
                  placeholder={current.placeholder}
                  onChange={(e) => {
                    setAnswers({ ...answers, [current.key]: e.target.value });
                    // Verberg fout zodra gebruiker begint met typen.
                    if (showError[otherKey]) setShowError({ ...showError, [otherKey]: false });
                  }}
                  onBlur={() => setShowError({ ...showError, [otherKey]: true })}
                  onKeyDown={(e) => { if (e.key === "Enter") goNext(); }}
                  aria-invalid={errorVisible}
                  aria-describedby={errorVisible ? `${otherKey}-error` : undefined}
                  className={cn(
                    "w-full rounded-2xl border bg-card px-5 py-4 text-base outline-none transition placeholder:text-muted-foreground/60",
                    errorVisible
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-brand",
                  )}
                />
              </div>
            ) : current.type === "longtext" ? (
              <div className="mt-4 sm:mt-6 md:mt-10">
                <textarea
                  autoFocus
                  value={typeof value === "string" ? value : ""}
                  placeholder={current.placeholder}
                  onChange={(e) => {
                    setAnswers({ ...answers, [current.key]: e.target.value });
                    if (showError[otherKey]) setShowError({ ...showError, [otherKey]: false });
                  }}
                  onBlur={() => setShowError({ ...showError, [otherKey]: true })}
                  aria-invalid={errorVisible}
                  className={cn(
                    "min-h-[160px] w-full rounded-2xl border bg-card px-5 py-4 text-base outline-none transition placeholder:text-muted-foreground/60",
                    errorVisible
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-brand",
                  )}
                />
                <p className={cn(
                  "mt-2 text-xs",
                  (typeof value === "string" ? value.trim().length : 0) >= 20 ? "text-brand" : "text-muted-foreground",
                )}>
                  {typeof value === "string" ? value.trim().length : 0} / 20 tekens
                </p>
              </div>
            ) : (
              (() => {
                const allOpts = [...current.options, ...(current.allowOther ? [OTHER] : [])];
                const dense = allOpts.length > 6;
                return (
                  <div
                    className={cn(
                      "mt-4 sm:mt-6 md:mt-10 grid gap-2 sm:gap-2.5",
                      dense
                        ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2",
                    )}
                  >
                    {allOpts.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                          "group flex items-center justify-between rounded-2xl border bg-card text-left transition",
                          dense ? "px-3 py-2.5 text-xs sm:text-sm" : "px-4 py-3.5 text-sm",
                          isSelected(opt)
                            ? "border-brand bg-brand/10 text-foreground"
                            : errorVisible
                              ? "border-destructive/50 hover:border-destructive"
                              : "border-border hover:border-brand/40",
                        )}
                      >
                        <span className="leading-tight">{opt}</span>
                        {isSelected(opt) && (
                          <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })()
            )}

            {isOtherActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <textarea
                  autoFocus
                  value={otherVal}
                  onChange={(e) => {
                    setOtherText({ ...otherText, [otherKey]: e.target.value });
                    if (showError[otherKey]) setShowError({ ...showError, [otherKey]: false });
                  }}
                  onBlur={() => setShowError({ ...showError, [otherKey]: true })}
                  placeholder="Vertel ons in eigen woorden (minimaal 4 tekens)…"
                  className={cn(
                    "min-h-[100px] w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60",
                    errorVisible
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-brand",
                  )}
                />
              </motion.div>
            )}

            {/* Inline foutmelding — verschijnt na blur of na klik op Volgende */}
            <AnimatePresence>
              {errorVisible && errorMsg && (
                <motion.div
                  id={`${otherKey}-error`}
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 border-t border-border pt-4 flex items-center justify-between sm:mt-10 sm:pt-5 md:mt-12">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                Terug
              </button>
              <button
                onClick={goNext}
                aria-disabled={!isValid}
                title={!isValid && errorMsg ? errorMsg : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
                  isValid
                    ? "bg-brand text-white shadow-sm hover:opacity-90"
                    : "bg-brand/30 text-white/90",
                )}
              >
                {safeStep === steps.length - 1 ? "Genereer rapport" : "Volgende"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

          </div>

          <aside className="md:sticky md:top-24">
            <LiveReportPreview answers={answers} pulseKey={safeStep} />
          </aside>
        </div>
      </div>
    </div>
  );
}
