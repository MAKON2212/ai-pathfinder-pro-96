/**
 * Server-only: detect tech-stack + business signals from a website.
 *
 * Two phases:
 *  1) One direct fetch on the homepage for response headers + raw HTML
 *     pattern matching (tech detection).
 *  2) Parse the already-scraped multi-page Firecrawl markdown for business
 *     signals (team-pagina, vacatures, prijzen, talen, content-velocity).
 *
 * Failure mode: every helper returns gracefully — never throws to the caller.
 */

export type SiteSignals = {
  detectedTech: string[];
  techMaturityScore: number;             // 0-100
  estimatedTeamSize?: number;
  estimatedCustomerVolume?: "low" | "medium" | "high";
  hasOpenRoles: boolean;
  openRoleCategories: string[];
  pricingDetected: boolean;
  pricePoints: number[];
  internationalReach: string[];          // e.g. ["NL","EN","DE"]
  contentVelocity: "none" | "low" | "medium" | "high";
  signalConfidence: number;              // 0-100
};

export const EMPTY_SIGNALS: SiteSignals = {
  detectedTech: [],
  techMaturityScore: 0,
  hasOpenRoles: false,
  openRoleCategories: [],
  pricingDetected: false,
  pricePoints: [],
  internationalReach: [],
  contentVelocity: "none",
  signalConfidence: 0,
};

// ---------- Tech detection ----------

type TechRule = { name: string; patterns: RegExp[]; weight: number };

const TECH_RULES: TechRule[] = [
  { name: "Shopify",       patterns: [/cdn\.shopify\.com/i, /myshopify\.com/i, /x-shopid/i], weight: 8 },
  { name: "WordPress",     patterns: [/wp-content/i, /wp-includes/i, /wp-json/i], weight: 4 },
  { name: "HubSpot",       patterns: [/hs-scripts\.com/i, /hubspot/i, /hsforms/i], weight: 9 },
  { name: "Klaviyo",       patterns: [/_klaviyo/i, /klaviyo\.com/i, /static\.klaviyo/i], weight: 8 },
  { name: "Intercom",      patterns: [/intercomcdn/i, /intercom\.io/i, /widget\.intercom/i], weight: 7 },
  { name: "Segment",       patterns: [/cdn\.segment\.com/i, /analytics\.js/i], weight: 8 },
  { name: "Google Analytics 4", patterns: [/googletagmanager\.com\/gtag/i, /gtag\(/i, /G-[A-Z0-9]{6,}/], weight: 5 },
  { name: "Yandex Metrica", patterns: [/mc\.yandex/i], weight: 3 },
  { name: "Hotjar",        patterns: [/hotjar\.com/i, /static\.hotjar/i], weight: 4 },
  { name: "Mailchimp",     patterns: [/mailchimp/i, /mc\.us\d+\.list-manage/i], weight: 5 },
  { name: "Pipedrive",     patterns: [/pipedrive/i], weight: 7 },
  { name: "Salesforce",    patterns: [/salesforce/i, /force\.com/i, /pardot/i], weight: 9 },
  { name: "Tailwind CSS",  patterns: [/cdn\.tailwindcss\.com/i, /tw-/, /class="[^"]*\b(?:flex|grid|px-\d|py-\d)\b[^"]*"/], weight: 4 },
  { name: "React",         patterns: [/__NEXT_DATA__/, /data-reactroot/i, /react-dom/i], weight: 6 },
  { name: "Next.js",       patterns: [/__NEXT_DATA__/, /\/_next\//], weight: 7 },
  { name: "Wix",           patterns: [/wix\.com/i, /wixstatic/i], weight: 1 },
  { name: "Squarespace",   patterns: [/squarespace\.com/i, /static1\.squarespace/i], weight: 1 },
];

function detectTechFromHtml(html: string, headers: Headers): { detectedTech: string[]; techMaturityScore: number } {
  const haystack = html + "\n" +
    [headers.get("server"), headers.get("x-powered-by"), headers.get("set-cookie")].filter(Boolean).join("\n");
  const detected = new Set<string>();
  let weight = 0;
  for (const rule of TECH_RULES) {
    if (rule.patterns.some((p) => p.test(haystack))) {
      detected.add(rule.name);
      weight += rule.weight;
    }
  }
  // Normalize to 0-100 (cap raw weight at 60 → maps to ~100).
  const techMaturityScore = Math.min(Math.round((weight / 60) * 100), 100);
  return { detectedTech: Array.from(detected), techMaturityScore };
}

async function fetchHomepage(url: string): Promise<{ html: string; headers: Headers } | null> {
  try {
    const cleaned = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(cleaned, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ScanAI-bot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 200_000);
    return { html, headers: res.headers };
  } catch (e) {
    console.warn("[site-signals] homepage fetch failed", e);
    return null;
  }
}

// ---------- Business signals from scraped markdown ----------

const TEAM_PATH_RE = /\/(team|over-?ons|about(?:-us)?|people|wie-?we-?zijn)\b/i;
const JOB_PATH_RE = /\/(vacature|vacatures|career|careers|jobs|werken-?bij|join-?us)\b/i;
const PRICING_PATH_RE = /\/(prijzen|pricing|tarieven|tarief|abonnement|plans?)\b/i;
const BLOG_PATH_RE = /\/(blog|nieuws|news|insights|artikelen)\b/i;

const NAME_PAIR_RE = /\b[A-Z][a-zà-ÿ]{2,}\s+(?:van\s|de\s|van der\s|van den\s)?[A-Z][a-zà-ÿ]{2,}\b/g;
const PRICE_RE = /€\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)(?!\d)/g;

function detectFromPages(pages: { url: string; markdown: string }[]): Partial<SiteSignals> {
  if (!pages.length) return {};

  const teamPage = pages.find((p) => TEAM_PATH_RE.test(p.url));
  const jobsPage = pages.find((p) => JOB_PATH_RE.test(p.url));
  const pricingPage = pages.find((p) => PRICING_PATH_RE.test(p.url));
  const blogPage = pages.find((p) => BLOG_PATH_RE.test(p.url));
  const allText = pages.map((p) => p.markdown).join("\n\n");

  // --- Team size from team page ---
  let estimatedTeamSize: number | undefined;
  if (teamPage) {
    const matches = teamPage.markdown.match(NAME_PAIR_RE) || [];
    // De-duplicate: same person often appears twice.
    const unique = new Set(matches.map((m) => m.toLowerCase()));
    if (unique.size >= 3) estimatedTeamSize = unique.size;
  }

  // --- Customer volume from case/klant mentions ---
  const caseMentions = (allText.match(/\b(case\s?stud(?:y|ies)|klant(?:en)?|customer[s]?|succes[a-z]*)\b/gi) || []).length;
  let estimatedCustomerVolume: "low" | "medium" | "high" | undefined;
  if (caseMentions >= 30) estimatedCustomerVolume = "high";
  else if (caseMentions >= 10) estimatedCustomerVolume = "medium";
  else if (caseMentions >= 3) estimatedCustomerVolume = "low";

  // --- Open roles ---
  const hasOpenRoles = !!jobsPage || /vacature|we\s?(?:are\s)?hiring|werken\s?bij/i.test(allText);
  const openRoleCategories: string[] = [];
  const roleHaystack = (jobsPage?.markdown || allText).toLowerCase();
  if (/sales|account executive|business development|sdr|bdr/i.test(roleHaystack)) openRoleCategories.push("sales");
  if (/engineer|developer|software|backend|frontend/i.test(roleHaystack)) openRoleCategories.push("engineering");
  if (/operations|operationeel|ops\b/i.test(roleHaystack)) openRoleCategories.push("operations");
  if (/marketing|content|growth|seo/i.test(roleHaystack)) openRoleCategories.push("marketing");
  if (/customer success|support|service/i.test(roleHaystack)) openRoleCategories.push("customer success");

  // --- Pricing ---
  let pricingDetected = false;
  let pricePoints: number[] = [];
  if (pricingPage) {
    pricingDetected = true;
    const raw = pricingPage.markdown.match(PRICE_RE) || [];
    pricePoints = raw
      .map((s) => Number(s.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".")))
      .filter((n) => Number.isFinite(n) && n >= 5 && n <= 50_000);
    // Dedupe + cap
    pricePoints = Array.from(new Set(pricePoints)).sort((a, b) => a - b).slice(0, 8);
  }

  // --- International reach ---
  const internationalReach: string[] = ["NL"];
  if (pages.some((p) => /\/en\//.test(p.url) || /\b(english|en\s?\|)/i.test(p.markdown.slice(0, 500)))) internationalReach.push("EN");
  if (pages.some((p) => /\/de\//.test(p.url))) internationalReach.push("DE");
  if (pages.some((p) => /\/fr\//.test(p.url))) internationalReach.push("FR");

  // --- Content velocity ---
  let contentVelocity: SiteSignals["contentVelocity"] = "none";
  if (blogPage) {
    // Count year-like dates in the last 2 years.
    const thisYear = new Date().getFullYear();
    const lastYear = thisYear - 1;
    const yearMatches = (blogPage.markdown.match(new RegExp(`\\b(${thisYear}|${lastYear})\\b`, "g")) || []).length;
    if (yearMatches >= 24) contentVelocity = "high";
    else if (yearMatches >= 12) contentVelocity = "medium";
    else if (yearMatches >= 3) contentVelocity = "low";
    else contentVelocity = "low";
  }

  return {
    estimatedTeamSize,
    estimatedCustomerVolume,
    hasOpenRoles,
    openRoleCategories,
    pricingDetected,
    pricePoints,
    internationalReach,
    contentVelocity,
  };
}

// ---------- Public API ----------

export async function detectSiteSignals(
  website: string,
  scrapedPages: { url: string; markdown: string }[],
): Promise<SiteSignals> {
  if (!website) return EMPTY_SIGNALS;

  const homepage = await fetchHomepage(website);
  const tech = homepage
    ? detectTechFromHtml(homepage.html, homepage.headers)
    : { detectedTech: [], techMaturityScore: 0 };

  const business = detectFromPages(scrapedPages);

  // Confidence = how many of the 8 signal-buckets returned data.
  const buckets = [
    tech.detectedTech.length > 0,
    business.estimatedTeamSize !== undefined,
    business.estimatedCustomerVolume !== undefined,
    business.hasOpenRoles === true,
    business.pricingDetected === true,
    (business.pricePoints?.length ?? 0) > 0,
    (business.internationalReach?.length ?? 0) > 1,
    business.contentVelocity !== "none",
  ];
  const filled = buckets.filter(Boolean).length;
  const signalConfidence = Math.round((filled / 8) * 100);

  return {
    ...EMPTY_SIGNALS,
    ...tech,
    ...business,
    signalConfidence,
  };
}
