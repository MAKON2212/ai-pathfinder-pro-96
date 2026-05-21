import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-3 pt-3 md:px-5 md:pt-4">
      {/* Floating pill nav */}
      <nav
        className="relative flex items-center justify-between rounded-[18px] px-4 py-2.5"
        style={{
          background: "rgba(20,16,8,0.55)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span
            className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[8px] text-[14px] font-bold"
            style={{
              background: "linear-gradient(135deg, #E8CB85, #876B2C)",
              color: "#0a0805",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 0 16px rgba(201,166,100,0.4)",
            }}
          >
            S
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-[#f5ecd7]">ScanAI</span>
        </Link>

        {/* Center status pill — desktop only */}
        <div className="hidden items-center gap-6 md:flex">
          {[
            { to: "/audit" as const, label: "AI Check" },
            { to: "/tools" as const, label: "Tools" },
            { to: "/about" as const, label: "About" },
            { to: "/contact" as const, label: "Contact" },
          ].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[12px] font-medium transition"
              style={{ color: "rgba(245,236,215,0.6)" }}
            >
              {n.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-2">
          <Link
            to="/audit"
            className="hidden items-center justify-center rounded-[10px] px-3.5 py-2 text-[12px] font-semibold transition hover:brightness-105 md:flex"
            style={{
              background: "linear-gradient(180deg, #FFE8A8, #C9A664)",
              color: "#14110a",
              boxShadow: "0 4px 16px rgba(201,166,100,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            Calculate free
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] md:hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {open ? (
              <X className="h-4 w-4 text-[#f5ecd7]" />
            ) : (
              <span
                className="block h-[1.5px] w-4 bg-[#f5ecd7]"
                style={{ boxShadow: "0 4px 0 #f5ecd7, 0 -4px 0 #f5ecd7" }}
              />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="mt-2 rounded-[16px] p-4 md:hidden"
          style={{
            background: "rgba(14,11,6,0.97)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(28px)",
          }}
        >
          {[
            { to: "/" as const, label: "Home" },
            { to: "/audit" as const, label: "AI Check" },
            { to: "/tools" as const, label: "Tools" },
            { to: "/about" as const, label: "About" },
            { to: "/contact" as const, label: "Contact" },
          ].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] font-medium text-[rgba(245,236,215,0.85)]"
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
