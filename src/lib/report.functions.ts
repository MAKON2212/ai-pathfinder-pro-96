import { createServerFn } from "@tanstack/react-start";
import { analyze, type AuditAnswers, type AuditResult } from "@/lib/audit";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type CompanyContext = {
  description: string;
  industry: string;
  products: string[];
  scrapedFrom: string | null;
  scrapedPages: string[];
  competitors: string[];
};

export type GeneratedReport = {
  executiveSummary: string;
  reportSnippets: string[];
  estimatedAnnualValue: number;
  formattedValue: string;
  valueBreakdown: AuditResult["valueBreakdown"];
  valueLineItems: AuditResult["valueLineItems"];
  scores: { readiness: number; automation: number; impact: number };
  scoreDetails: AuditResult["scoreDetails"];
  radar: AuditResult["radar"];
  roadmap: AuditResult["roadmap"];
  tools: AuditResult["tools"];
  companyContext: CompanyContext;
  chapters: { title: string; body: string }[];
  qaNotes: string[];
  quickWins: AuditResult["quickWins"];
  weeklyPlan: AuditResult["weeklyPlan"];
  sensitivity: AuditResult["sensitivity"];
  reportId?: string;
  accessToken?: string;
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// ---------- Firecrawl helpers ----------

type ScrapeResult = { url: string; markdown: string; title?: string };

async function firecrawlScrape(url: string): Promise<ScrapeResult | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey || !url) return null;
  try {
    const cleaned = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: cleaned, formats: ["markdown"], onlyMainContent: true }),
    });
    if (!res.ok) {
      console.error("[Firecrawl] scrape error", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return null;
    }
    const data = await res.json() as { data?: { markdown?: string; metadata?: { title?: string; sourceURL?: string } } };
    return {
      url: data?.data?.metadata?.sourceURL || cleaned,
      markdown: (data?.data?.markdown || "").slice(0, 6000),
      title: data?.data?.metadata?.title,
    };
  } catch (e) {
    console.error("[Firecrawl] scrape failed", e);
    return null;
  }
}

async function firecrawlMap(url: string): Promise<string[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey || !url) return [];
  try {
    const cleaned = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch("https://api.firecrawl.dev/v2/map", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: cleaned, limit: 50 }),
    });
    if (!res.ok) {
      console.error("[Firecrawl] map error", res.status);
      return [];
    }
    const data = await res.json() as { links?: Array<string | { url?: string }>; data?: { links?: string[] } };
    const links: string[] = (data.links || data.data?.links || []).map((l) => typeof l === "string" ? l : (l?.url || "")).filter(Boolean);
    return links;
  } catch (e) {
    console.error("[Firecrawl] map failed", e);
    return [];
  }
}

/** Pick top-3 most informative pages from a sitemap (services, about, pricing). */
function pickTopPages(allLinks: string[], baseUrl: string): string[] {
  const base = baseUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const sameDomain = allLinks.filter((l) => l.includes(base));
  const priority = ["diensten", "services", "wat-wij-doen", "what-we-do", "over", "about", "prijzen", "pricing", "tarieven", "producten", "products", "oplossingen", "solutions", "cases"];
  const scored = sameDomain.map((url) => {
    const lower = url.toLowerCase();
    const score = priority.findIndex((p) => lower.includes(p));
    return { url, score: score === -1 ? 999 : score, depth: (url.match(/\//g) || []).length };
  }).sort((a, b) => a.score - b.score || a.depth - b.depth);
  const picked: string[] = [];
  const seen = new Set<string>();
  for (const s of scored) {
    if (picked.length >= 3) break;
    const norm = s.url.replace(/[#?].*$/, "").replace(/\/$/, "");
    if (seen.has(norm)) continue;
    seen.add(norm);
    picked.push(s.url);
  }
  return picked;
}

async function multiPageScrape(website: string): Promise<{ pages: ScrapeResult[]; combined: string }> {
  if (!website) return { pages: [], combined: "" };
  const home = await firecrawlScrape(website);
  const pages: ScrapeResult[] = home ? [home] : [];
  try {
    const links = await firecrawlMap(website);
    const top = pickTopPages(links, website).filter((u) => u !== home?.url).slice(0, 3);
    const extras = await Promise.all(top.map((u) => firecrawlScrape(u)));
    for (const e of extras) if (e && e.markdown.length > 200) pages.push(e);
  } catch (e) {
    console.error("[Firecrawl] map+scrape pipeline failed", e);
  }
  const combined = pages
    .map((p) => `### Pagina: ${p.url}\n${p.title ? `Titel: ${p.title}\n` : ""}${p.markdown.slice(0, 2500)}`)
    .join("\n\n---\n\n")
    .slice(0, 12000);
  return { pages, combined };
}

// ---------- AI helpers ----------

async function callAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts?: { model?: string; jsonMode?: boolean },
) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const body: Record<string, unknown> = {
    model: opts?.model || "google/gemini-2.5-flash",
    messages,
  };
  if (opts?.jsonMode) body.response_format = { type: "json_object" };

  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI rate limit bereikt — probeer over een minuut opnieuw.");
    if (res.status === 402) throw new Error("AI credits op — neem contact op met de eigenaar.");
    throw new Error(`AI error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content || "";
}

function safeParseJSON<T>(raw: string, fallback: T): T {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]) as T; } catch { /* ignore */ }
    }
    return fallback;
  }
}

// ---------- Competitor scan via AI brainstorm ----------

async function suggestCompetitors(answers: AuditAnswers, scrapeContext: string): Promise<string[]> {
  try {
    const raw = await callAI(
      [
        { role: "system", content: "Je bent een marktanalist. Antwoord ALLEEN met JSON: {\"competitors\":[\"naam\",...]} — max 3 directe Nederlandse/Europese concurrenten van het beschreven bedrijf." },
        { role: "user", content: `BEDRIJF: ${answers.companyName}\nBRANCHE: ${answers.industry}\nWEBSITE-CONTEXT (eerste pagina):\n${scrapeContext.slice(0, 1500)}\n\nGeef max 3 directe concurrenten. Alleen namen, geen URLs.` },
      ],
      { model: "google/gemini-2.5-flash-lite", jsonMode: true },
    );
    const parsed = safeParseJSON<{ competitors?: string[] }>(raw, {});
    return (parsed.competitors || []).slice(0, 3);
  } catch (e) {
    console.error("[AI] competitor suggest failed", e);
    return [];
  }
}

// ---------- Server function ----------

export const generateReport = createServerFn({ method: "POST" })
  .inputValidator((input: { answers: AuditAnswers }) => {
    if (!input?.answers || typeof input.answers !== "object") throw new Error("Invalid answers");
    if (!input.answers.companyName || input.answers.companyName.length < 1) throw new Error("Bedrijfsnaam ontbreekt");
    return input;
  })
  .handler(async ({ data }): Promise<GeneratedReport> => {
    const { answers } = data;
    const baseline = analyze(answers);

    // STEP 1: Multi-page Firecrawl (homepage + map + top 3 pages)
    const { pages, combined } = answers.website
      ? await multiPageScrape(answers.website)
      : { pages: [], combined: "" };

    console.log(`[Firecrawl] scraped ${pages.length} pages for ${answers.companyName}:`, pages.map((p) => p.url));

    // STEP 2: Competitor brainstorm via AI
    const competitors = combined ? await suggestCompetitors(answers, combined) : [];

    const companyContext: CompanyContext = {
      description: combined.slice(0, 1500) || `${answers.companyName} actief in ${answers.industry || "onbekende branche"}`,
      industry: answers.industry || "Onbekend",
      products: [],
      scrapedFrom: pages.length > 0 ? answers.website : null,
      scrapedPages: pages.map((p) => p.url),
      competitors,
    };

    // STEP 3: Build deep prompt with all financial follow-ups
    const recommendedTools = baseline.tools
      .map((t) => `- ${t.name} (${t.category}) — ${t.useCase} | Prijs: ${t.pricing || "?"} | Setup: ${t.setupTime || "?"} | Eerste stap: ${t.firstStep || "?"}`)
      .join("\n");

    const followUps: string[] = [];
    if (answers.grossMargin) followUps.push(`Bruto marge: ${answers.grossMargin}`);
    if (answers.avgHourlyCost) followUps.push(`Gemiddeld uurloon: ${answers.avgHourlyCost}`);
    if (answers.churnRate) followUps.push(`Churn: ${answers.churnRate}`);
    if (answers.customerServiceVolume) followUps.push(`Klantenservice volume: ${answers.customerServiceVolume}`);
    if (answers.customerServiceChannels?.length) followUps.push(`CS kanalen: ${answers.customerServiceChannels.join(", ")}`);
    if (answers.repetitiveHoursPerWeek) followUps.push(`Repetitieve uren/week: ${answers.repetitiveHoursPerWeek}`);
    if (answers.invoicesPerMonth) followUps.push(`Facturen/mnd: ${answers.invoicesPerMonth}`);
    if (answers.contentPiecesPerMonth) followUps.push(`Content/mnd: ${answers.contentPiecesPerMonth}`);
    if (answers.leadsPerMonth) followUps.push(`Leads/mnd: ${answers.leadsPerMonth}`);
    if (answers.conversionRate) followUps.push(`Conversie: ${answers.conversionRate}`);
    if (answers.salesCycleLength) followUps.push(`Sales-cyclus: ${answers.salesCycleLength}`);
    if (answers.primaryChannel) followUps.push(`Primair kanaal: ${answers.primaryChannel}`);
    if (answers.ecommercePlatform) followUps.push(`E-commerce platform: ${answers.ecommercePlatform}`);
    if (answers.serviceModel) followUps.push(`Dienstverleningsmodel: ${answers.serviceModel}`);
    if (answers.manufacturingType) followUps.push(`Productietype: ${answers.manufacturingType}`);

    const systemPrompt = `Je bent een ervaren AI-strategie consultant in Nederland die voor MKB en scale-ups concrete, kwantificeerbare AI-adviezen schrijft. Je toon is rationeel, zakelijk en nuchter — geen marketing-fluff. Je kwantificeert ALTIJD waarde in euro's met expliciete rekensommen.

WERKWIJZE — chain-of-thought:
1. Lees de website-scrape (meerdere pagina's) en bouw een mental model: wat doet dit bedrijf, voor wie, hoe verdienen ze, waar zit de operationele last.
2. Vertaal elk pijnpunt naar 1-2 specifieke tools uit de aanbevolen lijst, mét de naam, prijs en eerste stap.
3. Onderbouw elke euro met een rekensom op basis van de meegegeven cijfers (uurloon × uren, marge × omzet, etc.).
4. Verwijs minimaal 2× expliciet naar iets dat je uit de website-scrape hebt gehaald (propositie, klanten, dienst).
5. Schrijf in vlot Nederlands, formeel maar toegankelijk. Noem het bedrijf consequent bij naam.

VASTE KOPPELINGEN:
- "Lead generatie" / "Omzet verhogen" → AI email marketing met Instantly.ai of Smartlead, gevoed door Clay-enrichment.
- "Trage klantenservice" / "Klantbeleving verbeteren" → Vapi of Retell AI voor 24/7 telefoon; Chatbase voor websitechat; Intercom Fin voor email/chat-tickets.
- "Repetitief handwerk" / "Data verspreid" → no-code automation via n8n of Make.com.
- "Administratie & facturatie" → Klippa voor factuurherkenning, Ramp voor spend management.
- "Content creatie" → Midjourney / Runway / Descript-stack.
- "Forecasting & planning" → Pecan AI.

Antwoord ALLEEN met geldige JSON volgens dit schema:
{
  "executiveSummary": "4-6 zinnen, begint met de bedrijfsnaam, noemt de geschatte jaarwaarde en de top-2 hefbomen, refereert naar iets uit de scrape",
  "reportSnippets": ["3 korte snippets van max 70 tekens, elk een kerninzicht"],
  "chapters": [
    {"title": "string", "body": "6-10 zinnen, met cijfers, bedrijfsnaam, concrete tool-namen en minstens 1 verwijzing naar de website-content"}
  ]
}
Maak EXACT 4 chapters met deze titels: "Wat ${answers.companyName} doet en waar de hefbomen liggen", "De drie grootste geld-kansen (met rekensom)", "Aanbevolen tool stack en hoe je hem inzet", "Risico's, aannames en wat we niet weten".`;

    const userPrompt = `BEDRIJF: ${answers.companyName}
WEBSITE: ${answers.website || "n.v.t."}
LINKEDIN: ${answers.linkedin || "n.v.t."}
SOCIALS: ${answers.socials || "n.v.t."}
BRANCHE: ${answers.industry}
TEAM: ${answers.size} medewerkers
JAAROMZET: ${answers.revenue}
GEMIDDELDE KLANTWAARDE/JR: ${answers.customerValue}
KLANTEN/JR: ${answers.customersPerYear}
HUIDIGE STACK: ${answers.techStack.join(", ") || "geen opgegeven"}
PIJNPUNTEN: ${answers.painPoints.join(", ") || "geen opgegeven"}
DOELEN: ${answers.goals.join(", ") || "geen opgegeven"}
BUDGET: ${answers.budget}
TIJDLIJN: ${answers.timeline}
GEWENSTE UITKOMST: ${answers.outcome}

DIEPERE FINANCIËLE & OPERATIONELE INPUT:
${followUps.length ? followUps.join("\n") : "(geen extra follow-ups ingevuld)"}

WAARSCHIJNLIJKE CONCURRENTEN (door AI gesuggereerd op basis van scrape):
${competitors.length ? competitors.join(", ") : "(geen)"}

WEBSITE-SCRAPE (${pages.length} pagina's via Firecrawl — gebruik dit ACTIEF in je tekst):
${combined || "Geen scrape beschikbaar — werk met de overige inputs."}

DETERMINISTISCHE BEREKENING (gebruik deze EXACTE cijfers):
- Geschatte jaarwaarde: € ${baseline.estimatedAnnualValue.toLocaleString("nl-NL")}
- Loonbesparing: € ${baseline.valueBreakdown.laborSavings.toLocaleString("nl-NL")}
- Omzet-uplift: € ${baseline.valueBreakdown.revenueUplift.toLocaleString("nl-NL")}
- Retentie-winst: € ${baseline.valueBreakdown.retentionGain.toLocaleString("nl-NL")}
- Tooling-efficiëntie: € ${baseline.valueBreakdown.efficiencyGain.toLocaleString("nl-NL")}

AANBEVOLEN TOOLS (gebruik in hoofdstuk 3 met naam + prijs + eerste stap):
${recommendedTools}

Genereer nu het rapport voor ${answers.companyName}.`;

    // STEP 4 — WRITER PASS
    let aiContent = "";
    try {
      aiContent = await callAI(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        { jsonMode: true },
      );
    } catch (e) {
      console.error("[AI] writer pass failed", e);
    }

    type AIShape = {
      executiveSummary?: string;
      reportSnippets?: string[];
      chapters?: { title: string; body: string }[];
      qaNotes?: string[];
    };

    let parsed = safeParseJSON<AIShape>(aiContent, {});

    // STEP 5 — REVIEWER PASS: detect vague claims, missing scrape references, wrong tools
    if (parsed.chapters && parsed.chapters.length > 0) {
      try {
        const reviewerSystem = `Je bent een strenge eindredacteur. Je krijgt een AI-gegenereerd rapport en je verfijnt het:
1. Schrap elke vaagheid ("kan helpen", "wellicht", "potentieel") en vervang door een concreet getal of tool-naam.
2. Check dat elke claim een rekensom of bron heeft. Voeg er één toe als die mist.
3. Check dat minstens 2 hoofdstukken expliciet naar de website-scrape verwijzen (gebruik de getoonde page-URLs).
4. Behoud de JSON-structuur 1-op-1. Antwoord ALLEEN met dezelfde JSON.`;
        const reviewerUser = `WEBSITE-SCRAPE BRONNEN (${pages.length} pagina's): ${pages.map((p) => p.url).join(", ") || "geen"}

DETERMINISTISCHE CIJFERS DIE MOETEN KLOPPEN:
- Jaarwaarde: € ${baseline.estimatedAnnualValue.toLocaleString("nl-NL")}
- Loonbesparing: € ${baseline.valueBreakdown.laborSavings.toLocaleString("nl-NL")}
- Omzet-uplift: € ${baseline.valueBreakdown.revenueUplift.toLocaleString("nl-NL")}
- Retentie: € ${baseline.valueBreakdown.retentionGain.toLocaleString("nl-NL")}

AAN TE BEVELEN TOOLS (alleen deze namen mogen in hoofdstuk 3):
${baseline.tools.map((t) => t.name).join(", ")}

ORIGINEEL RAPPORT (JSON):
${JSON.stringify(parsed)}

Lever het verfijnde rapport in dezelfde JSON-structuur.`;
        const reviewed = await callAI(
          [
            { role: "system", content: reviewerSystem },
            { role: "user", content: reviewerUser },
          ],
          { jsonMode: true, model: "google/gemini-2.5-flash" },
        );
        const reviewedParsed = safeParseJSON<AIShape>(reviewed, {});
        if (reviewedParsed.chapters && reviewedParsed.chapters.length > 0) {
          parsed = reviewedParsed;
          console.log("[AI] reviewer pass applied successfully");
        }
      } catch (e) {
        console.error("[AI] reviewer pass failed, keeping writer output", e);
      }
    }

    const formatted = new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(baseline.estimatedAnnualValue);

    const fallbackSnippets = [
      `${answers.companyName} kan ${formatted} per jaar unlocken.`,
      `Top kans: ${answers.painPoints[0] || "operationele frictie"} aanpakken met AI.`,
      `${answers.size} FTE × ${answers.industry || "branche"} → ROI binnen 90 dagen.`,
    ];

    const fallbackChapters = [
      {
        title: `Wat ${answers.companyName} doet en waar de hefbomen liggen`,
        body: `${answers.companyName} laat naar verwachting ${formatted} per jaar liggen. Dit bestaat uit € ${baseline.valueBreakdown.laborSavings.toLocaleString("nl-NL")} aan loonbesparing, € ${baseline.valueBreakdown.revenueUplift.toLocaleString("nl-NL")} extra omzet en € ${baseline.valueBreakdown.retentionGain.toLocaleString("nl-NL")} aan retentie-winst.`,
      },
      ...baseline.roadmap.slice(0, 3).map((r) => ({ title: r.title, body: r.description })),
    ];

    const finalReport: GeneratedReport = {
      executiveSummary: parsed.executiveSummary || baseline.summary,
      reportSnippets: (parsed.reportSnippets && parsed.reportSnippets.length === 3) ? parsed.reportSnippets : fallbackSnippets,
      estimatedAnnualValue: baseline.estimatedAnnualValue,
      formattedValue: formatted,
      valueBreakdown: baseline.valueBreakdown,
      valueLineItems: baseline.valueLineItems,
      scores: {
        readiness: baseline.readinessScore,
        automation: baseline.automationScore,
        impact: baseline.impactScore,
      },
      scoreDetails: baseline.scoreDetails,
      radar: baseline.radar,
      roadmap: baseline.roadmap,
      tools: baseline.tools,
      companyContext,
      chapters: parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : fallbackChapters,
      qaNotes: parsed.qaNotes && parsed.qaNotes.length > 0 ? parsed.qaNotes : [
        `Aannames over team-grootte en klant-economics zijn op basis van eigen opgave van ${answers.companyName}.`,
        `Berekening gaat uit van branche-benchmark van 30% automatiseerbare tijd.`,
        `Werkelijke ROI hangt af van adoptie binnen het team — eerste 90 dagen kritisch.`,
      ],
      quickWins: baseline.quickWins,
      weeklyPlan: baseline.weeklyPlan,
      sensitivity: baseline.sensitivity,
    };

    // Persist report to database (best-effort — never block the user on this)
    try {
      const avgScore = Math.round(
        (finalReport.scores.readiness + finalReport.scores.automation + finalReport.scores.impact) / 3,
      );
      const accessToken = (await import("crypto")).randomBytes(24).toString("hex");
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from("reports")
        .insert([{
          company: answers.companyName,
          contact_email: answers.email ?? null,
          industry: answers.industry ?? null,
          team_size: answers.size ?? null,
          score: avgScore,
          annual_value_cents: Math.round(finalReport.estimatedAnnualValue * 100),
          currency: "EUR",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          answers: answers as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          report: finalReport as any,
          source: "audit",
          paid: false,
          access_token: accessToken,
        }])
        .select("id, access_token")
        .single();
      if (insertErr) {
        console.error("[reports] insert failed", insertErr);
      } else if (inserted?.id) {
        finalReport.reportId = inserted.id;
        finalReport.accessToken = inserted.access_token as string;
      }
    } catch (e) {
      console.error("[reports] save failed", e);
    }

    return finalReport;
  });

// ---------- Magic-link access ----------

export const getReportByToken = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; token: string }) => {
    if (typeof input?.id !== "string" || !/^[0-9a-f-]{36}$/.test(input.id)) {
      throw new Error("Ongeldige rapport-ID");
    }
    if (typeof input?.token !== "string" || !/^[a-f0-9]{16,128}$/.test(input.token)) {
      throw new Error("Ongeldige toegangstoken");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("reports")
      .select("id, company, contact_email, paid, report, created_at, access_token")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Rapport niet gevonden");
    if (row.access_token !== data.token) throw new Error("Onjuiste toegangstoken");
    return {
      id: row.id,
      company: row.company,
      contactEmail: row.contact_email,
      paid: row.paid,
      report: row.report as unknown as GeneratedReport,
      createdAt: row.created_at,
    };
  });

export const setReportEmail = createServerFn({ method: "POST" })
  .inputValidator((input: { reportId: string; email: string }) => {
    if (typeof input?.reportId !== "string" || !/^[0-9a-f-]{36}$/.test(input.reportId)) {
      throw new Error("Ongeldige rapport-ID");
    }
    if (typeof input?.email !== "string" || input.email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new Error("Ongeldig e-mailadres");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("reports")
      .update({ contact_email: data.email, updated_at: new Date().toISOString() })
      .eq("id", data.reportId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
