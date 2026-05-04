import type { AuditAnswers } from "./audit";

/**
 * Lichtgewicht "live" waarde-schatter voor tijdens het invullen van de AI Check.
 * Geeft een [low, high] range terug op basis van wat al ingevuld is.
 *
 * Niet hetzelfde als recomputeValueModel — dat draait pas na de volledige flow.
 * Hier gaat het om een snelle, indicatieve teller die de gebruiker tijdens
 * het invullen al ziet groeien, zodat ze zien wat AI kan opleveren.
 */

const REVENUE_MIDPOINT: Record<string, number> = {
  "< € 100K": 75_000,
  "€ 100K – € 500K": 300_000,
  "€ 500K – € 2M": 1_250_000,
  "€ 2M – € 10M": 6_000_000,
  "€ 10M+": 18_000_000,
};

const SIZE_FTE: Record<string, number> = {
  "1–10": 6,
  "11–50": 25,
  "51–200": 100,
  "201–1000": 400,
  "1000+": 1500,
};

const HOURLY_MIDPOINT: Record<string, number> = {
  "< € 30": 25,
  "€ 30 – € 50": 40,
  "€ 50 – € 80": 65,
  "€ 80 – € 120": 100,
  "> € 120": 140,
};

const MARGIN_MIDPOINT: Record<string, number> = {
  "< 20%": 0.15,
  "20 – 40%": 0.3,
  "40 – 60%": 0.5,
  "60 – 80%": 0.7,
  "> 80%": 0.85,
};

const CHURN_MIDPOINT: Record<string, number> = {
  "< 5%": 0.03,
  "5 – 10%": 0.075,
  "10 – 20%": 0.15,
  "20 – 40%": 0.3,
  "> 40%": 0.5,
  Onbekend: 0.12,
};

const CUSTOMER_VALUE_MIDPOINT: Record<string, number> = {
  "< € 100": 60,
  "€ 100 – € 500": 300,
  "€ 500 – € 2.500": 1_500,
  "€ 2.500 – € 10K": 6_000,
  "€ 10K+": 18_000,
};

const CUSTOMERS_MIDPOINT: Record<string, number> = {
  "< 50": 30,
  "50 – 250": 150,
  "250 – 1.000": 600,
  "1.000 – 10.000": 4_000,
  "10.000+": 25_000,
};

const REPETITIVE_HOURS_MIDPOINT: Record<string, number> = {
  "< 5 uur": 3,
  "5 – 20 uur": 12,
  "20 – 60 uur": 40,
  "60 – 200 uur": 120,
  "> 200 uur": 280,
};

const CS_VOLUME_MIDPOINT: Record<string, number> = {
  "< 25 / week": 15,
  "25 – 100 / week": 60,
  "100 – 500 / week": 300,
  "500 – 2.000 / week": 1_200,
  "> 2.000 / week": 3_000,
};

const INVOICE_VOLUME_MIDPOINT: Record<string, number> = {
  "< 50 / mnd": 30,
  "50 – 250 / mnd": 150,
  "250 – 1.000 / mnd": 600,
  "> 1.000 / mnd": 1_500,
};

const LEAD_VOLUME_MIDPOINT: Record<string, number> = {
  "< 25 / mnd": 15,
  "25 – 100 / mnd": 60,
  "100 – 500 / mnd": 300,
  "500 – 2.000 / mnd": 1_200,
  "> 2.000 / mnd": 3_000,
};

const CONVERSION_MIDPOINT: Record<string, number> = {
  "< 1%": 0.005,
  "1 – 3%": 0.02,
  "3 – 7%": 0.05,
  "7 – 15%": 0.1,
  "> 15%": 0.18,
  Onbekend: 0.025,
};

export type LiveValueEstimate = {
  /** Lage band, afgerond op € 1.000. */
  low: number;
  /** Hoge band, afgerond op € 1.000. */
  high: number;
  /** Hoeveel van de relevante velden ingevuld zijn (0 – 1). Voor confidence-UI. */
  confidence: number;
};

/**
 * Geeft een [low, high] schatting van de jaarlijkse AI-waarde op basis van
 * de tot nu toe ingevulde antwoorden. Werkt incrementeel: hoe meer velden,
 * hoe rijker de schatting.
 *
 * Filosofie:
 *  - We splitsen waarde in 3 buckets: loonbesparing, omzet-uplift, retentie.
 *  - Elke ingevulde antwoord-band activeert of verfijnt één bucket.
 *  - Range = [base * 0.6, base * 1.6] om realistische onzekerheid te tonen.
 */
export function estimateLiveValue(a: Partial<AuditAnswers>): LiveValueEstimate {
  let labor = 0;
  let revenue = 0;
  let retention = 0;

  const fte = a.size ? SIZE_FTE[a.size] : 0;
  const hourly = a.avgHourlyCost ? HOURLY_MIDPOINT[a.avgHourlyCost] : 45; // default als onbekend
  const annualRevenue = a.revenue ? REVENUE_MIDPOINT[a.revenue] : 0;
  const margin = a.grossMargin ? MARGIN_MIDPOINT[a.grossMargin] : 0.4;

  // ----- Loonbesparing -----
  // Heuristiek: 8 – 12% van team-uren wordt vrijgespeeld door AI op repetitief werk.
  if (fte > 0) {
    const annualHoursPerFte = 1700;
    const fteSavingsRate = 0.08; // basis 8%
    labor = fte * annualHoursPerFte * fteSavingsRate * hourly;
  }

  // Specifieke pijnpunten verhogen de besparing.
  if (a.repetitiveHoursPerWeek) {
    const hrs = REPETITIVE_HOURS_MIDPOINT[a.repetitiveHoursPerWeek] || 0;
    // 60% van die uren is automatiseerbaar.
    labor = Math.max(labor, hrs * 0.6 * 48 * hourly);
  }
  if (a.customerServiceVolume) {
    const tickets = CS_VOLUME_MIDPOINT[a.customerServiceVolume] || 0;
    // 8 min/ticket * 70% deflectie via AI-agent.
    const minutesSaved = tickets * 8 * 0.7 * 48;
    labor += (minutesSaved / 60) * hourly;
  }
  if (a.invoicesPerMonth) {
    const inv = INVOICE_VOLUME_MIDPOINT[a.invoicesPerMonth] || 0;
    // 3 min handwerk/factuur * 80% automatiseerbaar.
    const minutesSaved = inv * 3 * 0.8 * 12;
    labor += (minutesSaved / 60) * hourly;
  }

  // ----- Omzet-uplift -----
  // Heuristiek: 3 – 6% omzetstijging via betere conversie / sales-enablement.
  if (annualRevenue > 0) {
    revenue = annualRevenue * 0.04 * margin; // marge-effect, niet bruto
  }
  if (a.leadsPerMonth && a.conversionRate) {
    const leads = LEAD_VOLUME_MIDPOINT[a.leadsPerMonth] || 0;
    const conv = CONVERSION_MIDPOINT[a.conversionRate] || 0.02;
    const customerVal = a.customerValue ? CUSTOMER_VALUE_MIDPOINT[a.customerValue] : 1_500;
    // +30% conversie via AI-lead-scoring & snellere follow-up.
    const extraCustomers = leads * 12 * conv * 0.3;
    revenue = Math.max(revenue, extraCustomers * customerVal * margin);
  }

  // ----- Retentie -----
  // Lagere churn = behouden customer lifetime value.
  if (a.customerValue && a.customersPerYear && a.churnRate) {
    const cv = CUSTOMER_VALUE_MIDPOINT[a.customerValue] || 0;
    const cust = CUSTOMERS_MIDPOINT[a.customersPerYear] || 0;
    const churn = CHURN_MIDPOINT[a.churnRate] || 0.12;
    // 15% relatieve churn-reductie.
    retention = cust * churn * 0.15 * cv * margin;
  }

  const base = labor + revenue + retention;

  // Confidence: percentage van kern-velden ingevuld.
  const coreFields: (keyof AuditAnswers)[] = [
    "industry",
    "size",
    "revenue",
    "avgHourlyCost",
    "grossMargin",
    "customerValue",
    "customersPerYear",
    "churnRate",
    "painPoints",
    "goals",
  ];
  const filled = coreFields.filter((k) => {
    const v = a[k];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" && v.length > 0;
  }).length;
  const confidence = filled / coreFields.length;

  if (base <= 0) {
    return { low: 0, high: 0, confidence };
  }

  // Range smaller naarmate confidence stijgt: van [0.5, 1.8] naar [0.8, 1.3].
  const lowMul = 0.5 + confidence * 0.3;
  const highMul = 1.8 - confidence * 0.5;

  const round = (n: number) => Math.max(1_000, Math.round(n / 1_000) * 1_000);

  return {
    low: round(base * lowMul),
    high: round(base * highMul),
    confidence,
  };
}
