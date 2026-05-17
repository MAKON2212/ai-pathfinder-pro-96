import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "AI Tools · ScanAI" },
      { name: "description", content: "A hand-picked selection of 200+ AI tools that ScanAI tracks daily for entrepreneurs." },
      { property: "og:title", content: "AI Tools · ScanAI" },
      { property: "og:description", content: "The best AI tools for businesses — hand-picked by ScanAI." },
    ],
  }),
  component: ToolsPage,
});

const TOOLS = [
  { name: "OpenAI / ChatGPT", category: "Generative AI", desc: "Conversational AI for writing, analysis and code.", url: "https://openai.com" },
  { name: "Anthropic Claude", category: "Generative AI", desc: "Model with long context and strong document analysis.", url: "https://anthropic.com" },
  { name: "Google Gemini", category: "Generative AI", desc: "Multimodal AI from Google.", url: "https://gemini.google.com" },
  { name: "Midjourney", category: "Image generation", desc: "Leading AI image generation.", url: "https://midjourney.com" },
  { name: "Runway", category: "Video", desc: "AI video generation and editing.", url: "https://runwayml.com" },
  { name: "ElevenLabs", category: "Voice", desc: "Realistic AI voices.", url: "https://elevenlabs.io" },
  { name: "Perplexity", category: "Research", desc: "AI search engine with citations.", url: "https://perplexity.ai" },
  { name: "Notion AI", category: "Productivity", desc: "AI in your knowledge base.", url: "https://notion.so/product/ai" },
  { name: "Zapier AI", category: "Automation", desc: "No-code workflow automation with AI.", url: "https://zapier.com" },
  { name: "Intercom Fin", category: "Customer support", desc: "AI agent for customer service.", url: "https://intercom.com/fin" },
  { name: "HubSpot Breeze", category: "Sales & Marketing", desc: "AI agents in CRM and marketing.", url: "https://hubspot.com" },
  { name: "GitHub Copilot", category: "Development", desc: "AI assistant for developers.", url: "https://github.com/features/copilot" },
  { name: "Pinecone", category: "Infrastructure", desc: "Vector database for AI knowledge.", url: "https://pinecone.io" },
  { name: "LangChain", category: "Infrastructure", desc: "Framework for AI applications.", url: "https://langchain.com" },
  { name: "Synthesia", category: "Video", desc: "AI video with avatars in 140+ languages.", url: "https://synthesia.io" },
];

function ToolsPage() {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-7xl py-24">
        <div className="border-b border-border pb-12">
          <span className="pill">· Hand-picked selection</span>
          <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-7xl">
            AI Tools that <span className="text-brand">work</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            A hand-picked selection of the most impactful AI tools for modern businesses —
            updated weekly.
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
            <h2 className="text-2xl font-medium tracking-tight">Want a personal selection?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Take the AI Check and get the tools that actually fit your business.
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
