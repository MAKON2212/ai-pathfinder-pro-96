import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { formatEUR } from "@/lib/value-calc";

type Props = {
  /** Yearly missed value (EUR) — animated. */
  value: number;
  /** 0..1 — share of form completed; drives meter fill. */
  progress: number;
  /** Optional caption under the amount. */
  label?: string;
  /** When true, switches to a more triumphant style (final reveal). */
  emphatic?: boolean;
};

export function ValueMeter({ value, progress, label = "Estimated missed value / year", emphatic = false }: Props) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => formatEUR(Math.round(v)));
  const prevValueRef = useRef(0);
  const sparkRef = useRef(0);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: "easeOut" });
    if (value > prevValueRef.current) sparkRef.current += 1;
    prevValueRef.current = value;
    return () => controls.stop();
  }, [value, mv]);

  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div
      className={`surface relative overflow-hidden px-5 py-4 ${
        emphatic ? "glow-money" : pct > 0 ? "glow-ring" : ""
      }`}
    >
      {/* Subtle ambient pulse */}
      {pct > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.45) 0%, rgba(34,197,94,0) 70%)",
            filter: "blur(20px)",
          }}
        />
      )}

      <div className="relative flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {Math.round(pct)}%
        </span>
      </div>

      <div className="relative mt-1.5 flex items-baseline gap-2">
        <motion.span
          key={`spark-${sparkRef.current}`}
          initial={{ scale: 0.92, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`gradient-value-text text-4xl font-bold tracking-tight sm:text-5xl ${
            emphatic ? "drop-shadow-[0_0_24px_rgba(34,197,94,0.5)]" : ""
          }`}
        >
          <motion.span>{display}</motion.span>
        </motion.span>
        <span className="text-xs text-muted-foreground">/ year</span>
      </div>

      {/* Meter */}
      <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-value)" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {pct > 0 && pct < 100 && (
          <motion.div
            aria-hidden
            className="absolute top-0 h-full w-12 rounded-full opacity-60"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
            animate={{ x: ["-3rem", "120%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}
