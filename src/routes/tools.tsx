import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "AI Tools · ScanAI" },
      { name: "description", content: "Een curated selectie van 200+ AI tools die ScanAI dagelijks bijhoudt voor ondernemers." },
      { property: "og:title", content: "AI Tools · ScanAI" },
      { property: "og:description", content: "De beste AI tools voor bedrijven — handgekozen door ScanAI." },
    ],
  }),
  component: ToolsPage,
});

const TOOLS = [
  { name: "OpenAI / ChatGPT", category: "Generative AI", desc: "Conversational AI voor schrijven, analyse en code.", url: "https://openai.com" },
  { name: "Anthropic Claude", category: "Generative AI", desc: "Long-context model met sterke document-analyse.", url: "https://anthropic.com" },
  { name: "Google Gemini", category: "Generative AI", desc: "Multimodale AI van Google.", url: "https://gemini.google.com" },
  { name: "Midjourney", category: "Image Generation", desc: "State-of-the-art AI beeldgeneratie.", url: "https://midjourney.com" },
  { name: "Runway", category: "Video", desc: "AI video generatie en editing.", url: "https://runwayml.com" },
  { name: "ElevenLabs", category: "Voice", desc: "Realistische AI voice synthesis.", url: "https://elevenlabs.io" },
  { name: "Perplexity", category: "Research", desc: "AI research engine met bronvermelding.", url: "https://perplexity.ai" },
  { name: "Notion AI", category: "Productivity", desc: "AI in je knowledge base.", url: "https://notion.so/product/ai" },
  { name: "Zapier AI", category: "Automation", desc: "No-code workflow automatisering met AI.", url: "https://zapier.com" },
  { name: "Intercom Fin", category: "Customer Support", desc: "AI agent voor klantenservice.", url: "https://intercom.com/fin" },
  { name: "HubSpot Breeze", category: "Sales & Marketing", desc: "AI agents in CRM en marketing.", url: "https://hubspot.com" },
  { name: "GitHub Copilot", category: "Development", desc: "AI pair programmer.", url: "https://github.com/features/copilot" },
  { name: "Pinecone", category: "Infrastructure", desc: "Vector database voor AI knowledge retrieval.", url: "https://pinecone.io" },
  { name: "LangChain", category: "Infrastructure", desc: "Framework voor AI applicaties.", url: "https://langchain.com" },
  { name: "Synthesia", category: "Video", desc: "AI video met avatars in 140+ talen.", url: "https://synthesia.io" },
];

function ToolsPage() {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-7xl py-24">
        <div className="border-b border-border pb-12">
          <span className="pill">· Curated toolset</span>
          <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-7xl">
            AI Tools die <span className="text-brand">werken</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            Een handgekozen selectie van de meest impactvolle AI-tools voor moderne bedrijven —
            wekelijks geüpdatet.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => (
            <motion.a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
              className="surface group block rounded-3xl p-7 transition hover:border-brand/40"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
                  {t.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-brand" />
              </div>
              <h3 className="mt-6 text-2xl font-medium tracking-tight">{t.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
            </motion.a>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">Wil je een persoonlijke selectie?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Doe de AI Check en krijg de tools die echt bij jouw bedrijf passen.
            </p>
          </div>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            Start AI Check
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
