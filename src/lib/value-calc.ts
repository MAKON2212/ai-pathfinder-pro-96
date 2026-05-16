/**
 * Deterministic value calculator — "Hoeveel geld loop je mis door geen AI?"
 *
 * Returns a yearly missed-revenue/cost number based on form answers.
 * No AI calls, no external deps — runs instantly client-side.
 */

export type ValueAnswers = {
  industry?: string;
  size?: string; // "1–10" | "11–50" | "51–200" | "201–1000" | "1000+"
  avgHourlyCost?: string; // "< € 30" | "€ 30 – € 50" | ...
  repetitiveHoursPerWeek?: string; // hours per FTE per week (range)
  painPoints?: string[];
  grossMargin?: string;
  missedLeadsPerMonth?: string; // "0" | "1 – 5" | "5 – 20" | "20+"
};

const TEAM_MID: Record<string, number> = {
  "1–10": 5,
  "11–50": 25,
  "51–200": 100,
  "201–1000": 400,
  "1000+": 1500,
};

const HOURLY_MID: Record<string, number> = {
  "< € 30": 25,
  "€ 30 – € 50": 40,
  "€ 50 – € 80": 65,
  "€ 80 – € 120": 100,
  "> € 120": 140,
};

const REP_HOURS_MID: Record<string, number> = {
  "< 5 uur": 3,
  "5 – 20 uur": 12,
  "20 – 60 uur": 40,
  "60 – 200 uur": 120,
  "> 200 uur": 260,
};

const MARGIN_MID: Record<string, number> = {
  "< 20%": 0.15,
  "20 – 40%": 0.3,
  "40 – 60%": 0.5,
  "60 – 80%": 0.7,
  "> 80%": 0.85,
};

const MISSED_LEADS_MID: Record<string, number> = {
  "0": 0,
  "1 – 5": 3,
  "5 – 20": 12,
  "20+": 30,
};

const INDUSTRY_DEAL: Record<string, number> = {
  "Retail & E-commerce": 80,
  "Finance & Verzekeringen": 2500,
  "Gezondheidszorg": 600,
  "Productie & Industrie": 4000,
  "Zakelijke dienstverlening": 3500,
  "Onderwijs": 400,
  "Marketing & Media": 2200,
  "Logistiek & Transport": 1800,
  "Bouw & Vastgoed": 6000,
  "Horeca & Toerisme": 250,
  "IT & Software": 4500,
  "Cybersecurity": 5500,
  "Juridisch & Notariaat": 2800,
  "Accountancy & Boekhouding": 1800,
  "Architectuur & Design": 3500,
  "Beauty & Wellness": 180,
};

function avgDealValue(industry?: string): number {
  if (!industry) return 1200;
  return INDUSTRY_DEAL[industry] ?? 1200;
}

function teamSize(size?: string): number {
  if (!size) return 0;
  return TEAM_MID[size] ?? 5;
}

function hourlyCost(h?: string): number {
  if (!h) return 0;
  return HOURLY_MID[h] ?? 50;
}

function repetitiveHours(r?: string): number {
  if (!r) return 0;
  return REP_HOURS_MID[r] ?? 0;
}

function margin(m?: string): number {
  if (!m) return 0.3;
  return MARGIN_MID[m] ?? 0.3;
}

function missedLeads(l?: string): number {
  if (!l) return 0;
  return MISSED_LEADS_MID[l] ?? 0;
}

/**
 * Returns yearly missed value in EUR.
 *
 * Two streams:
 * 1. Labor savings: team-wide repetitive hours that AI can offload (~60%).
 * 2. Missed deals: leads slipping through capacity gaps × deal value × margin.
 *
 * Pain-point multiplier rewards companies with admin-heavy workflows.
 */
export function calcMissedValue(a: ValueAnswers): {
  total: number;
  laborYearly: number;
  leadsYearly: number;
  low: number;
  high: number;
  progress: number; // 0..1 — how complete is the answer set
} {
  const hourly = hourlyCost(a.avgHourlyCost);
  const repHrs = repetitiveHours(a.repetitiveHoursPerWeek);
  // repHrs is total team hours/week on repetitive work — team size is already
  // implicit in this number (ranges go up to 200+ hrs/week which only makes
  // sense as team-total), so we do NOT multiply by team again.
  const painCount = a.painPoints?.length ?? 0;
  const painMult = 1 + Math.min(painCount, 5) * 0.08;

  const laborYearly = Math.round(repHrs * 52 * hourly * 0.6 * painMult);

  const leads = missedLeads(a.missedLeadsPerMonth);
  const deal = avgDealValue(a.industry);
  const m = margin(a.grossMargin);
  // Weight by margin but keep below gross deal value (max ~0.83×). Higher-margin
  // companies feel a missed lead harder, low-margin less so.
  const leadsYearly = Math.round(leads * 12 * deal * (0.4 + m * 0.5));

  const total = laborYearly + leadsYearly;

  const requiredKeys: (keyof ValueAnswers)[] = [
    "industry",
    "size",
    "avgHourlyCost",
    "repetitiveHoursPerWeek",
    "painPoints",
    "grossMargin",
    "missedLeadsPerMonth",
  ];
  const filled = requiredKeys.filter((k) => {
    const v = a[k];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== "";
  }).length;
  const progress = filled / requiredKeys.length;

  return {
    total,
    laborYearly,
    leadsYearly,
    low: Math.round(total * 0.8),
    high: Math.round(total * 1.2),
    progress,
  };
}

export function formatEUR(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "€ 0";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
