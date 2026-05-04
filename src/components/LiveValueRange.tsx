import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { estimateLiveValue } from "@/lib/live-value";
import type { AuditAnswers } from "@/lib/audit";
import { cn } from "@/lib/utils";

/**
 * Live waarde-teller die tijdens het invullen van de AI Check meegroeit.
 * Toont een [low, high] range op basis van wat al bekend is, zodat de
 * gebruiker direct ziet dat AI geld kan opleveren / besparen.
 */
export function LiveValueRange({ answers }: { answers: Partial<AuditAnswers> }) {
  const { low, high, confidence } = estimateLiveValue(answers);
  const hasValue = high > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "mb-8 overflow-hidden rounded-2xl border bg-card px-5 py-4 transition-colors",
        hasValue ? "border-brand/30" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              hasValue ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground",
            )}
          >
            <TrendingUp className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Geschatte jaarwaarde · live
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {hasValue
                ? "Wat AI jouw bedrijf realistisch kan opleveren of besparen"
                : "Beantwoord een paar vragen — we rekenen direct mee"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${low}-${high}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "font-mono text-base font-semibold tabular-nums leading-none md:text-lg",
                hasValue ? "text-brand" : "text-muted-foreground/60",
              )}
            >
              {hasValue ? (
                <>
                  <AnimatedNumber value={low} />
                  <span className="mx-1.5 text-muted-foreground">–</span>
                  <AnimatedNumber value={high} />
                </>
              ) : (
                "€ — — —"
              )}
            </motion.p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Per jaar · {Math.round(confidence * 100)}% zicht
            </p>
          </AnimatePresence>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={false}
          animate={{ width: `${Math.max(4, confidence * 100)}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "h-full rounded-full",
            hasValue ? "bg-brand" : "bg-muted-foreground/30",
          )}
        />
      </div>
    </motion.div>
  );
}

/** Tween-animatie naar een nieuwe waarde — onthoudt vorige voor smooth transitions. */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const delta = value - start;
    if (delta === 0) return;
    const dur = 600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const next = Math.round(start + delta * eased);
      setDisplay(next);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span>€ {display.toLocaleString("nl-NL")}</span>;
}
