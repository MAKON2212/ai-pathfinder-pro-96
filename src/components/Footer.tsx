import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 px-4 pb-10">
      <div className="mx-auto max-w-[1240px] rounded-3xl border border-white/8 bg-black/40 p-8 backdrop-blur-xl md:p-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-primary-foreground">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="text-[16px] font-semibold tracking-tight">ScanAI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI-driven insights. We translate AI into concrete results for your business — fast, practical, measurable.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Pages</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link to="/" className="text-foreground/80 hover:text-foreground">Home</Link>
              <Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link>
              <Link to="/tools" className="text-foreground/80 hover:text-foreground">Portfolio</Link>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link>
            </nav>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Get In Touch</h4>
            <p className="mt-4 text-sm text-foreground/80">hello@scanai.app</p>
            <Link
              to="/audit"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-[13px] font-medium text-primary-foreground shadow-[0_8px_24px_rgba(212,176,98,0.45)] transition hover:brightness-110"
            >
              Start AI Check
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/8 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ScanAI. All rights reserved.</p>
          <p>Next-Gen AI Studio</p>
        </div>
      </div>
    </footer>
  );
}
