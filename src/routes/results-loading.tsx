import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { generateReport } from "@/lib/report.functions";
import type { AuditAnswers } from "@/lib/audit";

export const Route = createFileRoute("/results-loading")({
  head: () => ({
    meta: [
      { title: "Rapport wordt gegenereerd · ScanAI" },
      { name: "description", content: "Even geduld — we stellen jouw persoonlijke AI rapport samen." },
    ],
  }),
  component: LoadingPage,
});

const STEPS = [
  { label: "Website analyseren", detail: "Firecrawl haalt jullie website op en leest de inhoud uit…" },
  { label: "Bedrijfscontext interpreteren", detail: "We koppelen de scrape aan jullie branche, team en stack." },
  { label: "Financiële berekening", detail: "Loonbesparing, omzet-uplift en retentie-winst worden uitgerekend." },
  { label: "Tools verzamelen", detail: "We selecteren AI-tools uit 200+ opties op basis van jullie pijnpunten." },
  { label: "Rapport schrijven", detail: "Een AI-consultant schrijft de hoofdstukken in heldere taal." },
  { label: "Tweede AI-agent reviewt", detail: "Een onafhankelijke agent controleert aannames en cijfers." },
  { label: "Verfijnen & afronden", detail: "Laatste polish, opmaak en voorvertoning klaarzetten." },
];

const STEP_DURATION = 2200;

function Typewriter({ text, speed = 22 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {shown}
      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brand align-middle" />
    </span>
  );
}

function LoadingPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  // Cycle through visual steps — one at a time, fade in/out.
  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => (s + 1) % STEPS.length);
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, []);

  // Kick off the actual server call once
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const raw = sessionStorage.getItem("audit_answers");
    if (!raw) {
      navigate({ to: "/audit" });
      return;
    }
    const answers = JSON.parse(raw) as AuditAnswers;

    const minDelay = new Promise((r) => setTimeout(r, STEPS.length * STEP_DURATION + 400));

    Promise.all([
      generateReport({ data: { answers } }),
      minDelay,
    ])
      .then(([report]) => {
        sessionStorage.setItem("audit_report", JSON.stringify(report));
        sessionStorage.setItem("audit_report_expires_at", String(Date.now() + 10 * 60 * 1000));
        navigate({ to: "/results", search: () => ({}) });
      })
      .catch((e) => {
        console.error(e);
        setError(e instanceof Error ? e.message : "Er ging iets mis.");
      });
  }, [navigate]);

  const step = STEPS[activeStep];

  return (
    <div className="px-6">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center py-32">
        <span className="pill"><Loader2 className="h-3 w-3 animate-spin" /> Rapport wordt opgesteld</span>
        <h1 className="mt-6 text-balance text-center text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
          We bouwen jouw <span className="text-brand">persoonlijke</span> AI rapport.
        </h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Dit duurt ongeveer {Math.round((STEPS.length * STEP_DURATION) / 1000)} seconden.
        </p>

        {/* Progress dots */}
        <div className="mt-12 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeStep ? "w-8 bg-brand" : i < activeStep ? "w-2 bg-brand/40" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Single rotating typewriter card */}
        <div className="mt-10 flex h-44 w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="surface w-full max-w-xl rounded-3xl p-8 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Stap {String(activeStep + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-4 text-2xl font-medium tracking-tight">{step.label}</p>
              <p className="mt-3 min-h-[2.5rem] font-mono text-sm text-muted-foreground">
                <Typewriter text={step.detail} />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {error && (
          <div className="mt-8 w-full max-w-xl rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive">Er ging iets mis</p>
            <p className="mt-1 text-foreground/80">{error}</p>
            <button
              onClick={() => { startedRef.current = false; setError(null); setActiveStep(0); }}
              className="mt-3 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-accent-foreground"
            >
              Opnieuw proberen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
