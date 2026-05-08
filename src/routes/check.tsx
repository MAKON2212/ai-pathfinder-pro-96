import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import {
  DATA_SYSTEMS,
  DECISION_PAINS,
  MAX_TOOL_BUDGETS,
  type AuditAnswers,
} from "@/lib/audit";
import { cn } from "@/lib/utils";
import { HypeBanner, ReportPreview } from "@/components/HypeBanner";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "AI Quick Check · 2 minuten · ScanAI" },
      { name: "description", content: "Vul URL + 5 korte vragen in en krijg een persoonlijk AI-rapport." },
      { property: "og:title", content: "AI Quick Check · ScanAI" },
      { property: "og:description", content: "URL + 5 vragen → persoonlijk AI-rapport in 2 minuten." },
    ],
  }),
  component: CheckPage,
});

type QuickAnswers = {
  companyName: string;
  website: string;
  dataSystems: string[];
  processMaturity: number;
  biggestTimeWaster: string;
  decisionPain: string;
  decisionPainOther: string;
  maxToolBudget: string;
};

const TOTAL = 7; // intro (company+url) counted as 2 steps + 5 quiz

function isValidUrl(raw: string): boolean {
  const v = raw.trim();
  if (!v) return false;
  const candidate = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(candidate);
    return u.hostname.includes(".") && !/\s/.test(u.hostname);
  } catch {
    return false;
  }
}

function CheckPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showError, setShowError] = useState(false);
  const [a, setA] = useState<QuickAnswers>({
    companyName: "",
    website: "",
    dataSystems: [],
    processMaturity: 50,
    biggestTimeWaster: "",
    decisionPain: "",
    decisionPainOther: "",
    maxToolBudget: "",
  });

  function validate(): string | null {
    switch (step) {
      case 0:
        if (a.companyName.trim().length < 2) return "Vul je bedrijfsnaam in (min. 2 tekens).";
        return null;
      case 1:
        if (!isValidUrl(a.website)) return "Vul een geldige URL in, bv. https://jouwbedrijf.nl";
        return null;
      case 2:
        if (a.dataSystems.length === 0) return "Selecteer minstens één optie.";
        return null;
      case 3:
        return null; // slider always has a value
      case 4:
        if (a.biggestTimeWaster.trim().length < 5) return "Schrijf minimaal 5 tekens — wees concreet.";
        return null;
      case 5:
        if (!a.decisionPain) return "Kies één optie.";
        if (a.decisionPain === "Anders" && a.decisionPainOther.trim().length < 4) return "Vul je eigen antwoord in.";
        return null;
      case 6:
        if (!a.maxToolBudget) return "Kies één optie.";
        return null;
      default:
        return null;
    }
  }

  const errorMsg = validate();
  const isValid = errorMsg === null;
  const errorVisible = showError && !isValid;

  function next() {
    if (!isValid) {
      setShowError(true);
      return;
    }
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
      setShowError(false);
    } else {
      finalize();
    }
  }

  function back() {
    setShowError(false);
    setStep((s) => Math.max(0, s - 1));
  }

  function finalize() {
    const decisionPainFinal = a.decisionPain === "Anders" ? a.decisionPainOther.trim() : a.decisionPain;
    // Build a minimal but complete AuditAnswers — defaults are intentionally neutral so deterministic
    // calculations still run while quiz answers drive scoring.
    const answers: AuditAnswers = {
      companyName: a.companyName.trim(),
      website: a.website.trim(),
      industry: "Onbekend",
      size: "11–50",
      revenue: "€ 500K – € 2M",
      techStack: [],
      painPoints: [],
      goals: [],
      budget: "Nog onbekend",
      outcome: a.biggestTimeWaster.trim(),
      timeline: "Binnen 3 maanden",
      customerValue: "€ 500 – € 2.500",
      customersPerYear: "50 – 250",
      // Quiz inputs
      dataSystems: a.dataSystems,
      processMaturity: a.processMaturity,
      biggestTimeWaster: a.biggestTimeWaster.trim(),
      decisionPain: decisionPainFinal,
      maxToolBudget: a.maxToolBudget,
    };
    sessionStorage.setItem("audit_answers", JSON.stringify(answers));
    sessionStorage.removeItem("audit_report");
    sessionStorage.removeItem("audit_report_expires_at");
    sessionStorage.removeItem("results_assumptions_overrides");
    navigate({ to: "/results-loading" });
  }

  function toggleDataSystem(opt: string) {
    setShowError(false);
    setA((prev) => {
      const has = prev.dataSystems.includes(opt);
      return { ...prev, dataSystems: has ? prev.dataSystems.filter((x) => x !== opt) : [...prev.dataSystems, opt] };
    });
  }

  const progress = ((step + 1) / TOTAL) * 100;

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl py-24">
        <HypeBanner index={step} />

        <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-brand"
            style={{ boxShadow: "0 0 8px var(--brand)" }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <Question title="Wat is de naam van je bedrijf?" subtitle="We personaliseren het rapport op deze naam.">
                <input
                  autoFocus
                  type="text"
                  value={a.companyName}
                  placeholder="Bijv. Acme B.V."
                  onChange={(e) => { setA({ ...a, companyName: e.target.value }); if (showError) setShowError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") next(); }}
                  className={inputCls(errorVisible)}
                />
              </Question>
            )}

            {step === 1 && (
              <Question title="Wat is jullie website?" subtitle="We lezen meerdere pagina's om het rapport te verrijken.">
                <input
                  autoFocus
                  type="url"
                  value={a.website}
                  placeholder="https://jouwbedrijf.nl"
                  onChange={(e) => { setA({ ...a, website: e.target.value }); if (showError) setShowError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") next(); }}
                  className={inputCls(errorVisible)}
                />
              </Question>
            )}

            {step === 2 && (
              <Question title="Welke systemen gebruiken jullie nu voor klantdata?" subtitle="Selecteer alles wat van toepassing is.">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {DATA_SYSTEMS.map((opt) => {
                    const selected = a.dataSystems.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleDataSystem(opt)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 text-left text-sm transition",
                          selected ? "border-brand bg-brand/10" : "border-border hover:border-brand/40",
                        )}
                      >
                        <span>{opt}</span>
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Question>
            )}

            {step === 3 && (
              <Question title="Hoe goed zijn jullie kernprocessen vastgelegd?" subtitle="Sleep om aan te geven waar jullie staan.">
                <div className="mt-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={a.processMaturity}
                    onChange={(e) => setA({ ...a, processMaturity: Number(e.target.value) })}
                    className="w-full accent-[var(--brand)]"
                  />
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>Niets op papier</span>
                    <span className="font-mono text-brand">{a.processMaturity}/100</span>
                    <span>Alles in SOP's</span>
                  </div>
                </div>
              </Question>
            )}

            {step === 4 && (
              <Question
                title="Welke taak kost jullie team de meeste tijd per week?"
                subtitle="Iets dat voelt als 'dit zou een computer moeten doen'. Dit antwoord bepaalt je #1 quick win."
              >
                <textarea
                  autoFocus
                  value={a.biggestTimeWaster}
                  maxLength={200}
                  placeholder="Bijv. handmatig offertes natypen vanuit mail naar ons CRM…"
                  onChange={(e) => { setA({ ...a, biggestTimeWaster: e.target.value }); if (showError) setShowError(false); }}
                  className={cn("min-h-[140px] resize-none", inputCls(errorVisible))}
                />
                <p className="mt-2 text-right font-mono text-xs text-muted-foreground">{a.biggestTimeWaster.length} / 200</p>
              </Question>
            )}

            {step === 5 && (
              <Question title="Welke terugkerende beslissing kost jullie het meeste hoofdpijn?">
                <div className="grid grid-cols-1 gap-2.5">
                  {[...DECISION_PAINS, "Anders"].map((opt) => {
                    const selected = a.decisionPain === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => { setA({ ...a, decisionPain: opt }); setShowError(false); }}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 text-left text-sm transition",
                          selected ? "border-brand bg-brand/10" : "border-border hover:border-brand/40",
                        )}
                      >
                        <span>{opt}</span>
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {a.decisionPain === "Anders" && (
                  <textarea
                    autoFocus
                    value={a.decisionPainOther}
                    placeholder="Vertel in eigen woorden…"
                    onChange={(e) => { setA({ ...a, decisionPainOther: e.target.value }); if (showError) setShowError(false); }}
                    className={cn("mt-3 min-h-[100px]", inputCls(errorVisible))}
                  />
                )}
              </Question>
            )}

            {step === 6 && (
              <Question title="Wat zou een AI-tool maximaal mogen kosten per maand?" subtitle="Helpt ons de tool stack realistisch te maken.">
                <div className="grid grid-cols-1 gap-2.5">
                  {MAX_TOOL_BUDGETS.map((opt) => {
                    const selected = a.maxToolBudget === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => { setA({ ...a, maxToolBudget: opt }); setShowError(false); }}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border bg-card px-4 py-3.5 text-left text-sm transition",
                          selected ? "border-brand bg-brand/10" : "border-border hover:border-brand/40",
                        )}
                      >
                        <span>{opt}</span>
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Question>
            )}

            <AnimatePresence>
              {errorVisible && errorMsg && (
                <motion.div
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

            <div className="mt-12 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-secondary disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                Terug
              </button>
              <button
                onClick={next}
                aria-disabled={!isValid}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
                  isValid ? "bg-brand text-accent-foreground hover:opacity-90" : "bg-secondary text-muted-foreground",
                )}
              >
                {step === TOTAL - 1 ? "Genereer rapport" : "Volgende"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <ReportPreview />
      </div>
    </div>
  );
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-balance text-3xl font-medium tracking-tighter md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-10">{children}</div>
    </div>
  );
}

function inputCls(error: boolean) {
  return cn(
    "w-full rounded-2xl border bg-card px-5 py-4 text-base outline-none transition placeholder:text-muted-foreground/60",
    error ? "border-destructive focus:border-destructive" : "border-border focus:border-brand",
  );
}
