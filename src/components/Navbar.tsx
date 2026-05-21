import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const NAV: { to: "/" | "/audit" | "/tools" | "/about" | "/contact"; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/audit", label: "AI Check" },
  { to: "/tools", label: "Tools" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-xl" style={{ background: "rgba(20,16,8,0.60)", backdropFilter: "blur(28px) saturate(180%)" }}>
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-5 md:h-11 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-[14px] font-semibold tracking-tight text-foreground">ScanAI</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[12px] text-foreground/85 transition hover:text-foreground"
              activeOptions={n.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/audit"
          className="hidden items-center justify-center rounded-2xl px-4 py-1.5 text-[12px] font-semibold text-[#14110a] transition hover:brightness-105 md:inline-flex"
          style={{ background: "linear-gradient(180deg, #FFE8A8, #C9A664)", boxShadow: "0 4px 16px rgba(201,166,100,0.35), inset 0 1px 0 rgba(255,255,255,0.4)" }}
        >
          Calculate free
        </Link>
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border backdrop-blur-xl md:hidden" style={{ background: "rgba(20,16,8,0.97)" }}>
          <nav className="mx-auto flex max-w-[1200px] flex-col px-5 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-[15px] font-medium text-foreground/85"
                activeOptions={n.exact ? { exact: true } : undefined}
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
