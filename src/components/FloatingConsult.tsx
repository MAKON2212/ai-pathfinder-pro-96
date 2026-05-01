import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FloatingConsult() {
  return (
    <Link
      to="/contact"
      className="surface fixed bottom-5 right-5 z-40 hidden items-center gap-3 rounded-full px-4 py-3 transition hover:border-brand md:flex"
    >
      <span className="h-2 w-2 rounded-full bg-brand" />
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Vragen?</p>
        <p className="text-sm font-medium">Boek een AI specialist</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
