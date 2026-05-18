import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Check } from "lucide-react";

const NAV: { to: "/" | "/audit" | "/tools" | "/about" | "/contact"; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
  { to: "/tools", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
  { to: "/audit", label: "AI Check" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-5">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between rounded-2xl border border-white/8 bg-black/60 px-3 py-2 backdrop-blur-xl md:rounded-full md:px-4 md:py-2.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-1.5" onClick={() => setOpen(false)}>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">ScanAI</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-1.5 text-[13px] text-foreground/70 transition hover:text-foreground"
              activeOptions={n.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-foreground bg-white/5" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          to="/audit"
          className="hidden rounded-full bg-brand px-5 py-2 text-[13px] font-medium text-white shadow-[0_8px_32px_rgba(99,44,255,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:brightness-110 md:inline-flex"
        >
          Get In Touch
        </Link>

        {/* Mobile menu */}
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-[1240px] rounded-2xl border border-white/8 bg-black/85 p-2 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground/85 hover:bg-white/5"
                activeOptions={n.exact ? { exact: true } : undefined}
                activeProps={{ className: "text-foreground bg-white/5" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/audit"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-brand px-3 py-3 text-center text-[15px] font-semibold text-white"
            >
              Get In Touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
