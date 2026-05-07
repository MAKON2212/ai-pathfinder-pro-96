import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[rgba(245,245,247,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[14px] font-semibold tracking-tight text-foreground">ScanAI</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" className="text-[12px] text-foreground/85 transition hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/audit" className="text-[12px] text-foreground/85 transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>AI Check</Link>
          <Link to="/tools" className="text-[12px] text-foreground/85 transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Tools</Link>
          <Link to="/about" className="text-[12px] text-foreground/85 transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Over ons</Link>
          <Link to="/contact" className="text-[12px] text-foreground/85 transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Contact</Link>
        </nav>
        <Link
          to="/audit"
          className="hidden rounded-full bg-[#0071e3] px-4 py-1.5 text-[12px] font-normal text-white transition hover:bg-[#0077ed] md:inline-flex"
        >
          Start AI Check
        </Link>
      </div>
    </header>
  );
}
