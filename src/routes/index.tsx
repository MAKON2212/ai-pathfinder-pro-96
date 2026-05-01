import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Quote, Star, TrendingUp, Lock, Eye } from "lucide-react";
import { HeroAnimation } from "@/components/HeroAnimation";
import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import review3 from "@/assets/review-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScanAI — Ontdek hoeveel AI jouw bedrijf oplevert" },
      {
        name: "description",
        content:
          "De meeste ondernemers weten niet welke AI verbeteringen écht geld opleveren. Doe de AI Check en ontdek hoeveel jouw bedrijf jaarlijks kan besparen of extra verdienen.",
      },
      { property: "og:title", content: "ScanAI — Verdien meer met AI" },
      {
        property: "og:description",
        content: "Persoonlijke AI roadmap die laat zien hoeveel geld je laat liggen.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-16">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            {/* Left content */}
            <div className="lg:col-span-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter text-foreground md:text-7xl"
              >
                Weet je niet hoe AI jouw bedrijf geld oplevert?<br />
                <span className="text-brand">Doe de AI-scan.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/audit"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-brand/20 transition hover:opacity-90"
                >
                  Start jouw AI Check
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold transition hover:bg-secondary"
                >
                  Hoe het werkt
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex items-center gap-4 text-xs text-muted-foreground"
              >
                <div className="flex -space-x-2">
                  <img src={review1} alt="" className="h-7 w-7 rounded-full border-2 border-background object-cover" />
                  <img src={review2} alt="" className="h-7 w-7 rounded-full border-2 border-background object-cover" />
                  <img src={review3} alt="" className="h-7 w-7 rounded-full border-2 border-background object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-brand">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                  <p>+800 ondernemers gingen je voor</p>
                </div>
              </motion.div>
            </div>

            {/* Right animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-6"
            >
              <HeroAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIDDEN VALUE / MONEY PROBLEM */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="pill">· Wat je laat liggen</span>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
              Er bestaan AI tools die hele <span className="text-brand">afdelingen</span> doen.
              <br />
              <span className="text-muted-foreground">Maar 4% van de ondernemers gebruikt ze.</span>
            </h2>
            <p className="mt-6 text-base text-muted-foreground">
              Wij houden wekelijks 200+ AI tools bij en zien dagelijks bedrijven
              tienduizenden euro's per maand laten liggen omdat ze simpelweg niet weten
              wat er bestaat.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { n: "€ 84K", title: "per jaar bespaard", desc: "Een MKB van 25 medewerkers door 1 AI agent voor klantenservice." },
                { n: "73%", title: "minder admin", desc: "Boekhoudkantoor automatiseerde factuurverwerking volledig met AI." },
                { n: "3×", title: "meer leads", desc: "B2B-bedrijf gebruikte AI voor outbound — zonder extra mensen." },
                { n: "12 uur", title: "p/w terug", desc: "Marketing team levert 3× zoveel content met dezelfde bezetting." },
              ].map((p) => (
                <div key={p.n} className="surface rounded-3xl p-6">
                  <div className="text-3xl font-semibold tracking-tighter text-brand">{p.n}</div>
                  <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col items-center text-center">
            <span className="pill">· Wat je krijgt</span>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
              Een rapport dat laat zien hoeveel je <span className="text-brand">verdient</span> aan AI.
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Geen vaag advies. Concrete cijfers, op maat van jouw branche en team.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { n: "01", title: "Geldwaarde-analyse", desc: "Concrete jaarlijkse besparing en extra omzet — in euro's, niet percentages." },
              { n: "02", title: "90-dagen Roadmap", desc: "Vier fases van quick wins tot volledige AI-integratie. Stap voor stap." },
              { n: "03", title: "Tool stack op maat", desc: "Aanbevelingen uit 200+ AI tools, gematched op jouw branche en stack." },
            ].map((f) => (
              <div key={f.n} className="surface rounded-3xl p-8">
                <div className="font-mono text-[11px] text-brand">{f.n}</div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <span className="pill">· Klanten</span>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl font-medium leading-tight tracking-tighter md:text-5xl">
            Ondernemers die hun winst <span className="text-brand">verdubbelden</span>.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              img: review1,
              name: "Mark de Vries",
              role: "CEO · Logistiek MKB",
              quote: "Ik dacht dat AI iets voor tech-bedrijven was. Het rapport liet zien dat we € 92K per jaar lieten liggen. Binnen 3 maanden eruit gehaald.",
              gain: "+ € 92K / jaar",
            },
            {
              img: review2,
              name: "Linda Hoekstra",
              role: "Founder · E-commerce",
              quote: "Wij verkopen sinds de implementatie 40% meer zonder extra advertentiekosten. Ik wist gewoon niet dat dit kon met AI.",
              gain: "+ 40% omzet",
            },
            {
              img: review3,
              name: "Pieter Janssen",
              role: "Eigenaar · Adviesbureau",
              quote: "We hebben 2 FTE's aan administratief werk vervangen door AI agents. Geen ontslagen — die mensen doen nu betere dingen.",
              gain: "− € 140K kosten",
            },
          ].map((r) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="surface flex flex-col rounded-3xl p-7"
            >
              <Quote className="h-5 w-5 text-brand" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                "{r.quote}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <img src={r.img} alt={r.name} loading="lazy" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                  {r.gain}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="surface relative overflow-hidden rounded-[2rem] p-12 md:p-16">
          <div className="absolute -top-1/2 -right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.08),transparent_60%)]" />
          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <span className="pill">· Volgende stap</span>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-tighter md:text-6xl">
                Reken zelf uit hoeveel<br />
                AI <span className="text-brand">jou oplevert</span>.
              </h2>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand" /> Concrete € waarde</div>
                <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-brand" /> Persoonlijk rapport</div>
                <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-brand" /> 100% vertrouwelijk</div>
              </div>
            </div>
            <div className="md:col-span-4">
              <p className="text-sm text-muted-foreground">
                10 vragen. 3 minuten. Direct je persoonlijke geldwaarde-analyse.
              </p>
              <Link
                to="/audit"
                className="mt-5 inline-flex w-full items-center justify-between gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-brand/20 transition hover:opacity-90"
              >
                Start de AI Check
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Rapport beschikbaar voor € 29 na de check.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
