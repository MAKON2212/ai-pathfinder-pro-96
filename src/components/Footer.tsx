import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-[11px] font-bold">S</span>
            <span className="text-sm font-semibold">ScanAI</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Personal AI roadmap for your business. Built in the Netherlands.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          <Link to="/audit" className="hover:text-foreground">AI Check</Link>
          <Link to="/tools" className="hover:text-foreground">Tools</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ScanAI
        </p>
      </div>
    </footer>
  );
}
