import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateReport } from "@/lib/report.functions";
import type { AuditAnswers } from "@/lib/audit";

export const Route = createFileRoute("/results-loading")({
  head: () => ({
    meta: [
      { title: "Generating your report · ScanAI" },
      { name: "description", content: "One moment — we're putting your personal AI report together." },
    ],
  }),
  component: LoadingPage,
});

const STEPS = [
  { label: "Reading website",       sub: "Multiple pages are scanned for context and tech stack." },
  { label: "Comparing industry",    sub: "Your sector is mirrored against 200+ benchmark companies." },
  { label: "Calculating financials", sub: "Labor savings, revenue uplift and retention are computed." },
  { label: "Matching tools",        sub: "The best AI tools for your situation are filtered from 200+." },
  { label: "Writing report",        sub: "Chapters are drafted in clear consultant language." },
  { label: "Running review",        sub: "Assumptions and numbers are checked for consistency." },
  { label: "Planning roadmap",      sub: "Quick wins and 90-day milestones are placed on the timeline." },
  { label: "Wrapping up",           sub: "Final check, formatting and the last polish." },
];

const STEP_DURATION = 2400;

function LoadingPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const raw = sessionStorage.getItem("audit_answers");
    if (!raw) { navigate({ to: "/audit" }); return; }
    const answers = JSON.parse(raw) as AuditAnswers;
    const minDelay = new Promise((r) => setTimeout(r, STEPS.length * STEP_DURATION + 400));

    Promise.all([generateReport({ data: { answers } }), minDelay])
      .then(([report]) => {
        sessionStorage.setItem("audit_report", JSON.stringify(report));
        // Persist permanent share-link credentials — report lives forever in DB
        if (report.reportId && report.accessToken) {
          try {
            localStorage.setItem(
              "audit_share_link",
              JSON.stringify({ id: report.reportId, token: report.accessToken, ts: Date.now() }),
            );
          } catch { /* ignore quota / privacy mode */ }
        }
        navigate({ to: "/results", search: { session_id: undefined, checkout: undefined } });
      })
      .catch((e) => {
        console.error(e);
        setError(e instanceof Error ? e.message : "Er ging iets mis.");
      });
  }, [navigate]);

  const progress = ((activeStep + 1) / STEPS.length) * 100;

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Ambient indigo glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.12), transparent 65%)" }} />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Step counter */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {String(activeStep + 1).padStart(2, "0")} — {String(STEPS.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Main step label */}
        <div className="relative h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeStep}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute text-center text-4xl font-bold tracking-tight md:text-5xl"
            >
              {STEPS[activeStep].label}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Sub-label */}
        <div className="relative mt-4 h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute text-center text-sm text-muted-foreground max-w-sm"
            >
              {STEPS[activeStep].sub}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Glowing progress bar */}
        <div className="mt-14 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-brand"
            style={{ boxShadow: "0 0 12px rgba(79,70,229,0.8)" }}
          />
        </div>

        {/* Animated step dots */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === activeStep ? 24 : 6,
                opacity: i < activeStep ? 0.35 : i === activeStep ? 1 : 0.15,
                backgroundColor: i <= activeStep ? "var(--brand)" : "rgba(255,255,255,0.3)",
              }}
              transition={{ duration: 0.4 }}
              className="block h-1 rounded-full"
            />
          ))}
        </div>

        {/* Completed steps checklist */}
        <div className="mt-14 space-y-3">
          <AnimatePresence>
            {STEPS.slice(0, activeStep).map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full"
                  style={{ background: "rgba(79,70,229,0.2)" }}>
                  <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 text-brand fill-none stroke-current" strokeWidth="1.8">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" />
                  </svg>
                </span>
                <span>{s.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <div className="mt-12 w-full max-w-lg rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-sm">
          <p className="font-semibold text-destructive">Er ging iets mis</p>
          <p className="mt-1 text-foreground/80">{error}</p>
          <button
            onClick={() => { startedRef.current = false; setError(null); setActiveStep(0); }}
            className="mt-3 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white"
          >
            Opnieuw proberen
          </button>
        </div>
      )}
    </div>
  );
}
