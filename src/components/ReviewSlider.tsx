import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import review3 from "@/assets/review-3.jpg";

const REVIEWS = [
  { img: review1, name: "Mark de Vries", company: "Logistiek MKB", quote: "€ 92K/jr eruit gehaald in 3 maanden." },
  { img: review2, name: "Linda Hoekstra", company: "E-commerce", quote: "+40% omzet zonder extra ad-spend." },
  { img: review3, name: "Pieter Janssen", company: "Adviesbureau", quote: "2 FTE admin vervangen, geen ontslagen." },
];

export function ReviewSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % REVIEWS.length), 3500);
    return () => clearInterval(id);
  }, []);
  const r = REVIEWS[i];
  return (
    <div className="surface w-full max-w-sm rounded-3xl p-5">
      <div className="flex items-center gap-1 text-brand">
        {[...Array(5)].map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}
        <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">800+ ondernemers</span>
      </div>
      <div className="mt-3 h-[68px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <img src={r.img} alt={r.name} className="h-12 w-12 flex-none rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{r.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{r.company}</p>
              <p className="mt-1 truncate text-[11px] text-foreground/80">"{r.quote}"</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
