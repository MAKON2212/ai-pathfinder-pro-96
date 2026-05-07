export type AuditAnswers = {
  companyName: string;
  industry: string;
  size: string;
  revenue: string;
  techStack: string[];
  painPoints: string[];
  goals: string[];
  budget: string;
  outcome: string;
  timeline: string;
  website: string;
  linkedin?: string;
  socials?: string;
  customerValue: string;
  customersPerYear: string;
  email?: string;

  // ----- Diepere financiële vragen -----
  grossMargin?: string;        // bruto marge band
  avgHourlyCost?: string;      // gemiddeld uurloon (incl. werkgeverslasten)
  churnRate?: string;          // jaarlijkse churn

  // ----- Vervolgvragen per pijnpunt -----
  customerServiceVolume?: string;  // calls/tickets per week
  customerServiceChannels?: string[]; // telefoon, email, chat, whatsapp
  repetitiveHoursPerWeek?: string; // FTE-uren per week aan repetitief handwerk
  invoicesPerMonth?: string;       // aantal facturen / bonnetjes per maand
  contentPiecesPerMonth?: string;  // aantal content-pieces per maand
  leadsPerMonth?: string;          // huidige leads per maand
  conversionRate?: string;         // huidige conversie %

  // ----- Vervolgvragen per doel -----
  salesCycleLength?: string;       // gemiddelde sales cyclus
  primaryChannel?: string;         // belangrijkste acquisitie kanaal

  // ----- Branche-specifieke vragen -----
  ecommercePlatform?: string;      // Shopify, WooCommerce, Magento ...
  serviceModel?: string;           // project-based, retainer, SaaS
  manufacturingType?: string;      // make-to-stock, make-to-order, custom

  // ----- Quick-check 5 vragen (uit /check flow) -----
  /** Q1 — welke systemen voor klantdata. */
  dataSystems?: string[];
  /** Q2 — process-documentatie volwassenheid 0-100. */
  processMaturity?: number;
  /** Q3 — open input grootste tijdvreter, max 200 chars. */
  biggestTimeWaster?: string;
  /** Q4 — terugkerende beslissing-pijn. */
  decisionPain?: string;
  /** Q5 — maximaal budget per maand voor AI tool. */
  maxToolBudget?: string;
};

export const DATA_SYSTEMS = [
  "CRM (HubSpot, Salesforce, Pipedrive…)",
  "Excel / Google Sheets",
  "Eigen database / tool",
  "Email inbox is onze CRM",
  "Geen idee / geen systeem",
];

export const DECISION_PAINS = [
  "Welke leads bellen we eerst",
  "Welke prijs vragen we deze klant",
  "Welke voorraad bestellen we",
  "Welke content maken we",
  "Welke medewerker zetten we waarop",
];

export const MAX_TOOL_BUDGETS = [
  "< € 100",
  "€ 100 – € 500",
  "€ 500 – € 2.000",
  "€ 2.000+",
  "Geen idee, hangt van ROI af",
];

export const INDUSTRIES = [
  "Retail & E-commerce",
  "Finance & Verzekeringen",
  "Gezondheidszorg",
  "Productie & Industrie",
  "Zakelijke dienstverlening",
  "Onderwijs",
  "Marketing & Media",
  "Logistiek & Transport",
  "Bouw & Vastgoed",
  "Horeca & Toerisme",
  "Bakker / Slager / Versspecialist",
  "Installatie (loodgieter, elektricien, cv)",
  "Auto & Garage",
  "Schoonmaak & Facility",
  "IT & Software",
  "Cybersecurity",
  "Juridisch & Notariaat",
  "Accountancy & Boekhouding",
  "Architectuur & Design",
  "Beauty & Wellness",
  "Sport & Fitness",
  "Agrarisch / Tuinbouw",
  "Non-profit / Stichting",
  "Overheid / Publiek",
];

export const SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

export const REVENUES = [
  "< € 100K",
  "€ 100K – € 500K",
  "€ 500K – € 2M",
  "€ 2M – € 10M",
  "€ 10M+",
];

export const TIMELINES = [
  "Direct, binnen 30 dagen",
  "Komend kwartaal",
  "Komende 6 maanden",
  "Verkenning, geen haast",
];

export const TECH_STACK = [
  "Microsoft 365",
  "Google Workspace",
  "Slack",
  "Notion",
  "Salesforce",
  "HubSpot",
  "SAP / ERP",
  "Eigen software",
  "Shopify",
  "WordPress",
];

export const PAIN_POINTS = [
  "Repetitief handwerk",
  "Trage klantenservice",
  "Data verspreid over systemen",
  "Content creatie kost te veel tijd",
  "Moeilijk talent te vinden",
  "Forecasting & planning",
  "Kwaliteitscontrole",
  "Lead generatie",
  "Administratie & facturatie",
];

export const GOALS = [
  "Operationele kosten verlagen",
  "Omzet verhogen",
  "Klantbeleving verbeteren",
  "Sneller beslissingen nemen",
  "Product innoveren",
  "Productiviteit medewerkers",
];

export const BUDGETS = ["< € 1K / mnd", "€ 1K – € 5K", "€ 5K – € 20K", "€ 20K+", "Nog onbekend"];

export const CUSTOMER_VALUES = [
  "< € 100",
  "€ 100 – € 500",
  "€ 500 – € 2.500",
  "€ 2.500 – € 10K",
  "€ 10K+",
];

export const CUSTOMERS_PER_YEAR = [
  "< 50",
  "50 – 250",
  "250 – 1.000",
  "1.000 – 10.000",
  "10.000+",
];

// ----- Diepere financiële opties -----
export const GROSS_MARGINS = ["< 20%", "20 – 40%", "40 – 60%", "60 – 80%", "> 80%"];
export const HOURLY_COSTS = ["< € 30", "€ 30 – € 50", "€ 50 – € 80", "€ 80 – € 120", "> € 120"];
export const CHURN_RATES = ["< 5%", "5 – 10%", "10 – 20%", "20 – 40%", "> 40%", "Onbekend"];

// ----- Vervolgvraag opties -----
export const CS_VOLUMES = ["< 25 / week", "25 – 100 / week", "100 – 500 / week", "500 – 2.000 / week", "> 2.000 / week"];
export const CS_CHANNELS = ["Telefoon", "Email", "Live chat", "WhatsApp", "Social DM", "Contactformulier"];
export const REPETITIVE_HOURS = ["< 5 uur", "5 – 20 uur", "20 – 60 uur", "60 – 200 uur", "> 200 uur"];
export const INVOICE_VOLUMES = ["< 50 / mnd", "50 – 250 / mnd", "250 – 1.000 / mnd", "> 1.000 / mnd"];
export const CONTENT_VOLUMES = ["< 5 / mnd", "5 – 20 / mnd", "20 – 100 / mnd", "> 100 / mnd"];
export const LEAD_VOLUMES = ["< 25 / mnd", "25 – 100 / mnd", "100 – 500 / mnd", "500 – 2.000 / mnd", "> 2.000 / mnd"];
export const CONVERSION_RATES = ["< 1%", "1 – 3%", "3 – 7%", "7 – 15%", "> 15%", "Onbekend"];
export const SALES_CYCLES = ["< 1 week", "1 – 4 weken", "1 – 3 maanden", "3 – 6 maanden", "> 6 maanden"];
export const PRIMARY_CHANNELS = ["Inbound / SEO", "Outbound / cold outreach", "Paid ads", "Referrals / partners", "Events / netwerk", "Marketplace"];

// ----- Branche-specifiek -----
export const ECOMMERCE_PLATFORMS = ["Shopify", "WooCommerce", "Magento", "Lightspeed", "BigCommerce", "Custom build"];
export const SERVICE_MODELS = ["Project-based", "Retainer / abonnement", "Hourly billing", "SaaS / product", "Mix"];
export const MANUFACTURING_TYPES = ["Make-to-stock", "Make-to-order", "Engineer-to-order", "Process / continu"];

export type ToolRec = {
  /** URL-veilige slug, gelijk aan de TOOL_DB key. */
  slug?: string;
  name: string;
  category: string;
  description: string;
  useCase: string;
  url: string;
  /** Domain used to render the tool's favicon/logo (Clearbit / Google s2). */
  domain: string;
  /** Indicatieve prijs per maand in EUR ranges. */
  pricing?: string;
  /** Gemiddelde setup-tijd om productie-waarde te halen. */
  setupTime?: string;
  /** Concrete eerste stap voor implementatie. */
  firstStep?: string;
};

/** Extra detail-content voor de tool-detailpagina (per slug). */
export type ToolDetail = {
  /** Korte tagline boven de fold op de detailpagina. */
  tagline: string;
  /** 3-5 concrete use-cases (bullets). */
  useCases: string[];
  /** Voor / na vergelijking. */
  beforeAfter: { before: string; after: string }[];
  /** 4-6 concrete instapstappen, in volgorde. */
  steps: { title: string; detail: string }[];
  /** Optioneel — best voor wie. */
  bestFor?: string;
  /** Optioneel — wanneer juist niet kiezen. */
  notFor?: string;
};

export const TOOL_DETAILS: Record<string, ToolDetail> = {
  openai: {
    tagline: "De snelste manier om je hele team productiever te maken met AI.",
    useCases: [
      "Voorstellen, offertes en e-mails opstellen in jullie tone-of-voice",
      "Meeting-recordings automatisch laten samenvatten met action items",
      "Interne copilots bouwen met GPTs op eigen documenten",
      "Marketing-copy en ad-variaties in serie genereren",
      "Spreadsheets en data ad-hoc analyseren in plain English",
    ],
    beforeAfter: [
      { before: "2 uur per voorstel handmatig schrijven.", after: "15 minuten — AI levert eerste 80% op basis van eerdere wins." },
      { before: "Meetings worden niet vastgelegd, actiepunten verdwijnen.", after: "Elke meeting eindigt met samenvatting + taken in Slack." },
      { before: "Marketing-team produceert 4 posts per week.", after: "12+ posts per week, gevarieerd qua format en kanaal." },
    ],
    steps: [
      { title: "ChatGPT Team activeren", detail: "€ 25 / gebruiker / mnd. Centrale workspace, data wordt niet voor training gebruikt." },
      { title: "3 use-cases kiezen met team", detail: "Bv. voorstellen schrijven, meeting-summaries, klant-research. Begin smal." },
      { title: "Custom GPTs bouwen", detail: "Per use-case 1 GPT met instructions + 5 voorbeelddocs uploaden." },
      { title: "Tone-of-voice kalibreren", detail: "5 beste eerdere voorstellen uploaden zodat output direct on-brand is." },
      { title: "Wekelijkse share-outs", detail: "10 min standup waarin team beste prompts deelt — versnelt adoptie." },
    ],
    bestFor: "Teams die snel willen experimenteren zonder developer.",
  },
  claude: {
    tagline: "Het beste model voor lange documenten en gevoelige analyses.",
    useCases: [
      "Contracten doorlezen en risico's markeren",
      "Beleidsstukken samenvatten voor management",
      "Hele kennisbank doorzoeken met natuurlijke vragen",
      "Tender-documenten analyseren tegen interne capabilities",
    ],
    beforeAfter: [
      { before: "Jurist leest 40 pagina's contract in 3 uur.", after: "Risico's binnen 10 minuten in bullets — jurist valideert." },
      { before: "RFP-respons kost een week.", after: "Eerste draft binnen een dag dankzij precieze document-Q&A." },
    ],
    steps: [
      { title: "Claude Pro of Team account openen", detail: "200K-context support — past complete contracten erin." },
      { title: "Project per documentstroom maken", detail: "Bv. 'Inkoopcontracten', 'Beleid', 'RFPs'." },
      { title: "Reference docs uploaden", detail: "Voorbeeldcontracten + interne checklist als context." },
      { title: "Eerste analyses dubbelchecken", detail: "Eerste 10 outputs door expert valideren — kalibreer prompts." },
    ],
    bestFor: "Juridisch, finance, compliance — alles met dichte documenten.",
  },
  n8n: {
    tagline: "Repetitieve taken tussen je tools volledig wegautomatiseren.",
    useCases: [
      "Inkomende e-mail/factuur → boekhouding zonder typen",
      "Webform → CRM → welkomstmail in één flow",
      "Wekelijkse rapportages automatisch samenstellen",
      "Tickets verrijken met klantcontext vóór ze bij support landen",
      "AI-stappen inzetten voor categorisatie of samenvatting",
    ],
    beforeAfter: [
      { before: "8 uur per week handmatig facturen overtypen.", after: "30 min controleren — workflow doet de rest." },
      { before: "Lead vult formulier in, blijft 1 dag liggen.", after: "Lead krijgt binnen 60 sec gepersonaliseerde welkomstmail." },
    ],
    steps: [
      { title: "Top-3 repetitieve handelingen lijsten", detail: "Vraag het team: wat doen jullie elke week dat saai is?" },
      { title: "n8n cloud of self-hosted starten", detail: "Cloud is sneller; self-hosted bespaart kosten bij volume." },
      { title: "Eerste workflow bouwen voor #1 taak", detail: "Begin smal: 1 trigger, 3-4 stappen. Test met echte data." },
      { title: "Foutafhandeling toevoegen", detail: "Zorg voor Slack-notificatie bij failures voordat je live gaat." },
      { title: "Workflow #2 en #3 bouwen", detail: "Pas wat je leerde toe op de andere 2 use-cases." },
    ],
    bestFor: "MKB met 5+ tools die niet goed met elkaar praten.",
  },
  vapi: {
    tagline: "24/7 telefoonopname zodat geen klant ooit nog onbeantwoord blijft.",
    useCases: [
      "Inkomende calls buiten kantooruren afvangen + terugbel-notitie",
      "Standaard FAQ-vragen direct beantwoorden",
      "Afsprakenplanner via telefoon",
      "Outbound bevestigingen of herinneringen bellen",
    ],
    beforeAfter: [
      { before: "20% van de calls gaat naar voicemail, helft belt nooit terug.", after: "100% beantwoord, gestructureerde lead-data in CRM." },
      { before: "Receptioniste verloren 2 uur/dag aan FAQ-calls.", after: "AI agent vangt 70% af — receptioniste werkt aan complexere zaken." },
    ],
    steps: [
      { title: "FAQ-script maken (10 vragen)", detail: "Schrijf de 10 vragen + ideale antwoorden uit." },
      { title: "Vapi-account + telefoonnummer", detail: "Twilio-koppeling of port bestaand nummer." },
      { title: "Agent bouwen + stem kiezen", detail: "ElevenLabs-stem voor natuurlijke ervaring." },
      { title: "Doorzet-regels instellen", detail: "Wanneer naar mens? Bv. boze klant-detectie of complex verzoek." },
      { title: "1 week parallel draaien", detail: "Naast bestaande lijn — analyseer transcripten dagelijks." },
    ],
    bestFor: "Bedrijven met >50 inkomende calls/week.",
    notFor: "Hoog-emotionele gesprekken (bv. uitvaart, zorg-crises).",
  },
  intercom: {
    tagline: "70% van support-tickets autonoom oplossen, 24/7.",
    useCases: [
      "Eerstelijns FAQ direct beantwoorden in chat & email",
      "Klant-data ophalen en personaliseren",
      "Tickets escaleren met volledige context naar agent",
      "Multi-language support zonder extra team",
    ],
    beforeAfter: [
      { before: "Gemiddeld 8 uur eerste response op email.", after: "8 sec — Fin antwoordt en lost direct op." },
      { before: "Support team van 5 voor 1.000 tickets/week.", after: "Team van 2 die alleen complexe cases doen." },
    ],
    steps: [
      { title: "Help center artikelen op orde brengen", detail: "Fin is zo goed als je content. Top 30 vragen up-to-date." },
      { title: "Fin trainen op 100 oude tickets", detail: "Laat zien hoe jullie eerder reageerden." },
      { title: "Resolution-confidence drempel zetten", detail: "Begin op 80% — escaleer alles eronder." },
      { title: "Wekelijkse content-review", detail: "Failed conversaties → nieuwe help-artikelen." },
    ],
    bestFor: "B2B SaaS met 500+ tickets/maand.",
  },
  klippa: {
    tagline: "Factuurverwerking en bonnetjes volledig automatisch boeken.",
    useCases: [
      "Inkomende facturen via mailbox → OCR → boekhouding",
      "Onkostendeclaraties via app door medewerker",
      "Automatische BTW-validatie en grootboek-koppeling",
      "Goedkeuringsworkflow per kostenplaats",
    ],
    beforeAfter: [
      { before: "Boekhouder typt 200 facturen/mnd handmatig (10 uur).", after: "200 facturen automatisch — 1 uur valideren." },
      { before: "Bonnetjes raken kwijt, BTW niet teruggevorderd.", after: "Foto in app → direct geboekt + BTW geclaimd." },
    ],
    steps: [
      { title: "Boekhoudpakket koppelen", detail: "Exact, AFAS, Twinfield, Snelstart, Yuki — allemaal supported." },
      { title: "Mailbox voor facturen activeren", detail: "Leveranciers mailen naar facturen@jouwbedrijf.nl." },
      { title: "Eerste 100 facturen door OCR", detail: "Train kostenplaats-mapping op echte voorbeelden." },
      { title: "Goedkeuringsregels instellen", detail: "Bv. > € 1.000 naar manager, anders direct boeken." },
      { title: "Medewerkers app uitrollen", detail: "Bonnetjes-app installatie meeting van 15 min." },
    ],
    bestFor: "MKB met 50+ facturen of 30+ declaraties per maand.",
  },
  instantly: {
    tagline: "Hyper-gepersonaliseerde cold outreach op autopilot voor meer leads.",
    useCases: [
      "Onbeperkte mailboxen voor schaalbare outbound",
      "Auto warm-up voor 100% deliverability",
      "AI-personalisatie per prospect op basis van LinkedIn/website",
      "Multi-step sequences met smart reply-detection",
    ],
    beforeAfter: [
      { before: "SDR doet 30 cold mails/dag handmatig, 1% reply.", after: "1.000 mails/dag, 4-6% reply door personalisatie + warm-up." },
      { before: "Inbox flagged als spam na 200 mails/dag.", after: "100% inbox-placement door domein- en mailbox-strategie." },
    ],
    steps: [
      { title: "5 secundaire domeinen kopen", detail: "Bescherm hoofddomein. Bv. tryjouwbedrijf.com, getjouwbedrijf.com." },
      { title: "15-25 mailboxen aanmaken + warm-up", detail: "2-3 weken auto warm-up voordat je eerste campagne start." },
      { title: "ICP definiëren + 500 prospects", detail: "Job titles, industries, company size — heel scherp." },
      { title: "Campagne van 4 stappen schrijven", detail: "Open, value, case-study, break-up. Houd kort." },
      { title: "A/B testen op subject lines", detail: "Eerste week: 3 varianten draaien, beste opschalen." },
    ],
    bestFor: "B2B sales-teams die outbound willen schalen voorbij 100 mails/dag.",
    notFor: "Sterk gereguleerde sectoren of consumenten-markten.",
  },
  hubspot: {
    tagline: "AI agents in CRM, marketing en sales — alles in één systeem.",
    useCases: [
      "Automatische lead scoring op gedrag + bedrijfsdata",
      "AI-gepersonaliseerde mail-flows per segment",
      "Content assistant voor blogs, landing pages, social",
      "Forecasting op basis van pipeline-historie",
    ],
    beforeAfter: [
      { before: "Sales benaderde leads zonder priority — 8% conversie.", after: "Top-scoring leads eerst — 18% conversie." },
      { before: "Marketing schrijft 1 blog/week.", after: "3 blogs/week + per blog 5 social-variaties." },
    ],
    steps: [
      { title: "Bestaande CRM-data importeren", detail: "Schoon eerst dubbele records op — start clean." },
      { title: "Lead-scoring activeren", detail: "Begin met simpele regels: site-bezoek, mail-open, demo-aanvraag." },
      { title: "1 mail-flow per segment", detail: "Welcome + nurture + win-back. Test 4 weken." },
      { title: "Content assistant koppelen aan brand voice", detail: "Upload 5 beste blogs als reference." },
    ],
    bestFor: "Bedrijven met 1.000+ contacts en gestructureerd sales-proces.",
  },
  github: {
    tagline: "AI-assistent voor je hele engineering-team.",
    useCases: [
      "Boilerplate code wegnemen — focus op logica",
      "Code review automatisch laten suggereren",
      "Tests genereren voor bestaande code",
      "Refactoren naar moderne patterns",
    ],
    beforeAfter: [
      { before: "Story-throughput van 8 punten/sprint per dev.", after: "12-14 punten/sprint na 4 weken adoptie." },
      { before: "Test-coverage 40%, niemand schrijft tests.", after: "Coverage 70% — Copilot suggereert tests bij elk PR." },
    ],
    steps: [
      { title: "GitHub Copilot Business activeren", detail: "Org-policy: blokkeer code uit publieke repos in suggesties." },
      { title: "1 squad als pilot kiezen", detail: "Meet baseline story-throughput 2 weken vooraf." },
      { title: "Best practices delen", detail: "Wekelijkse 'prompt-tips' deelmoment in standup." },
      { title: "Uitrollen naar hele engineering", detail: "Na 4 weken pilot — verzamel ROI-cijfers." },
    ],
    bestFor: "Engineering teams van 5+ developers.",
  },
  // Default-template voor tools zonder eigen detail
};

export const TOOL_DB: Record<string, ToolRec> = {
  // Generative & research
  openai: { name: "ChatGPT (OpenAI)", category: "Generatieve AI", description: "Gespreks-AI voor schrijven, analyse en redenering.", useCase: "Voorstellen schrijven, meetings samenvatten, interne copilots bouwen.", url: "https://openai.com", domain: "openai.com", pricing: "€ 20 / gebruiker / mnd", setupTime: "1 dag", firstStep: "ChatGPT Team workspace activeren en 3 use-cases met team kiezen." },
  claude: { name: "Anthropic Claude", category: "Generatieve AI", description: "Model met lange context en sterke documentanalyse.", useCase: "Contracten, beleid en grote kennisbanken analyseren.", url: "https://anthropic.com", domain: "anthropic.com", pricing: "€ 20 / gebruiker / mnd", setupTime: "1 dag", firstStep: "Claude Projects aanmaken voor de 3 grootste documentstromen." },
  perplexity: { name: "Perplexity", category: "Onderzoek", description: "AI-research engine met bronvermelding.", useCase: "Marktonderzoek, concurrentie-analyse, due diligence.", url: "https://perplexity.ai", domain: "perplexity.ai", pricing: "€ 20 / gebruiker / mnd", setupTime: "< 1 uur", firstStep: "Spaces opzetten per accountmanager voor klant-research." },
  notionai: { name: "Notion AI", category: "Productiviteit", description: "AI in je kennisbank.", useCase: "Auto-samenvattingen, taken genereren, interne docs.", url: "https://notion.so/product/ai", domain: "notion.so", pricing: "€ 10 / gebruiker / mnd", setupTime: "1 week", firstStep: "Bestaande Notion bijwerken naar AI plan en meeting-template aanmaken." },

  // No-code automation (repetitieve taken)
  n8n: { name: "n8n", category: "No-code Automation", description: "Open-source workflow automatisering met 400+ integraties en native AI nodes.", useCase: "Repetitieve taken tussen je tools wegautomatiseren — facturen, leads, rapportages.", url: "https://n8n.io", domain: "n8n.io", pricing: "€ 0 self-hosted / vanaf € 20 cloud", setupTime: "2 weken", firstStep: "Top-3 repetitieve handelingen in kaart brengen en eerste workflow bouwen." },
  make: { name: "Make.com", category: "No-code Automation", description: "Visuele workflow-builder met drag-and-drop scenarios.", useCase: "Multi-step processen automatiseren zonder developer.", url: "https://make.com", domain: "make.com", pricing: "vanaf € 9 / mnd", setupTime: "1-2 weken", firstStep: "Free tier proberen op 1 echte hand-off (bv. lead → CRM)." },
  zapier: { name: "Zapier", category: "No-code Automation", description: "Marktleider in app-koppelingen, met AI-stappen ingebouwd.", useCase: "Snel point-to-point automatiseringen tussen 6.000+ apps.", url: "https://zapier.com", domain: "zapier.com", pricing: "vanaf € 20 / mnd", setupTime: "< 1 week", firstStep: "Zaps maken voor inbox → CRM en formulier → Slack." },

  // Email marketing & outbound
  instantly: { name: "Instantly.ai", category: "AI Email Marketing", description: "AI cold outreach platform met onbeperkte mailboxen en deliverability-tools.", useCase: "Hyper-gepersonaliseerde outbound campagnes draaien op autopilot voor meer leads en omzet.", url: "https://instantly.ai", domain: "instantly.ai", pricing: "vanaf € 37 / mnd", setupTime: "2-3 weken (warm-up)", firstStep: "5 mailboxen warm-up starten en 1 ICP-campagne van 500 prospects opzetten." },
  smartlead: { name: "Smartlead", category: "AI Email Marketing", description: "AI-gedreven cold email met automatische warm-up en personalisatie.", useCase: "Schaalbare lead generatie voor B2B sales teams.", url: "https://smartlead.ai", domain: "smartlead.ai", pricing: "vanaf € 39 / mnd", setupTime: "2-3 weken", firstStep: "Domein-warm-up + spintax-templates maken voor eerste segment." },
  clay: { name: "Clay", category: "Lead Enrichment", description: "AI prospect-onderzoek en data enrichment in één workflow.", useCase: "Lead lijsten verrijken met persoonlijke insights vóór outreach.", url: "https://clay.com", domain: "clay.com", pricing: "vanaf € 134 / mnd", setupTime: "1 week", firstStep: "ICP definiëren en eerste enrichment-tabel met 500 leads bouwen." },
  hubspot: { name: "HubSpot Breeze", category: "Sales & Marketing", description: "AI agents in CRM, marketing en content.", useCase: "Lead scoring, e-mail personalisatie, content creatie.", url: "https://hubspot.com", domain: "hubspot.com", pricing: "vanaf € 90 / mnd", setupTime: "2-4 weken", firstStep: "Bestaande CRM-data importeren en lead-scoring activeren." },

  // Klantenservice & voice
  vapi: { name: "Vapi", category: "AI Voice Agent", description: "Realtime AI voice agents die telefoon opnemen, beantwoorden en doorzetten.", useCase: "24/7 telefoonopname zodat geen klant ooit nog onbeantwoord blijft.", url: "https://vapi.ai", domain: "vapi.ai", pricing: "± € 0,08 / minuut + setup", setupTime: "1-2 weken", firstStep: "FAQ-script bouwen en Vapi-agent koppelen aan bestaand telefoonnummer." },
  retell: { name: "Retell AI", category: "AI Voice Agent", description: "Lage-latency AI bel-agent met natuurlijke stem.", useCase: "Inbound & outbound calls automatiseren — kwalificatie, support, afspraken.", url: "https://retellai.com", domain: "retellai.com", pricing: "± € 0,07 / minuut", setupTime: "1-2 weken", firstStep: "Demo-bot bouwen voor afsprakenplanner en testen met 10 collega's." },
  intercom: { name: "Intercom Fin", category: "Klantenservice", description: "AI agent die klantvragen direct oplost in chat & email.", useCase: "Tot 70% van support tickets autonoom afhandelen, 24/7.", url: "https://intercom.com/fin", domain: "intercom.com", pricing: "± € 0,90 per opgelost gesprek", setupTime: "1-2 weken", firstStep: "Help center artikelen import + Fin trainen op laatste 100 tickets." },
  chatbase: { name: "Chatbase", category: "Custom AI Chatbot", description: "Train een GPT-chatbot op je eigen website & docs in minuten.", useCase: "Leads kwalificeren en FAQ's afvangen direct op je site of contactformulier.", url: "https://chatbase.co", domain: "chatbase.co", pricing: "vanaf € 19 / mnd", setupTime: "< 1 dag", firstStep: "Website + 5 PDF's uploaden en widget op contactpagina plaatsen." },

  // Facturatie & finance
  klippa: { name: "Klippa SpendControl", category: "AI Finance", description: "AI bonnetjes-, factuur- en spend-herkenning met automatische boeking.", useCase: "Factuurverwerking en onkostendeclaraties volledig automatiseren.", url: "https://klippa.com", domain: "klippa.com", pricing: "vanaf € 5 / gebruiker / mnd", setupTime: "1-2 weken", firstStep: "Boekhoudpakket koppelen en eerste 100 facturen door OCR halen." },
  ramp: { name: "Ramp", category: "AI Finance", description: "Spend management platform met AI insights & auto-categorisatie.", useCase: "Bedrijfsuitgaven automatisch coderen en goedkeuren.", url: "https://ramp.com", domain: "ramp.com", pricing: "Gratis core / paid tiers", setupTime: "2 weken", firstStep: "Bedrijfskaarten uitrollen en accounting-rules instellen." },

  // Content & creative
  midjourney: { name: "Midjourney", category: "Beeldgeneratie", description: "State-of-the-art AI beeldgeneratie.", useCase: "Marketing visuals, mockups en brand assets maken.", url: "https://midjourney.com", domain: "midjourney.com", pricing: "vanaf € 10 / mnd", setupTime: "< 1 dag", firstStep: "Brand style-guide vertalen naar 3 prompt-templates." },
  runway: { name: "Runway", category: "AI Video", description: "AI video generatie en editing.", useCase: "Marketing video's en product demo's produceren.", url: "https://runwayml.com", domain: "runwayml.com", pricing: "vanaf € 15 / mnd", setupTime: "1 week", firstStep: "Eerste 30s product-explainer maken en testen op LinkedIn." },
  elevenlabs: { name: "ElevenLabs", category: "AI Voice", description: "Realistische AI voice synthesis & dubbing.", useCase: "Voice-overs, IVR systemen, meertalige content.", url: "https://elevenlabs.io", domain: "elevenlabs.io", pricing: "vanaf € 5 / mnd", setupTime: "< 1 dag", firstStep: "Eigen stem klonen voor onboarding-video's of IVR." },
  descript: { name: "Descript", category: "Contentcreatie", description: "Video & podcast editing op tekst-basis met AI.", useCase: "Webinars en podcasts 5× sneller produceren.", url: "https://descript.com", domain: "descript.com", pricing: "vanaf € 15 / mnd", setupTime: "1 week", firstStep: "Bestaande webinar herbewerken en in 8 social clips knippen." },

  // Development & data
  github: { name: "GitHub Copilot", category: "Ontwikkeling", description: "AI-assistent voor programmeurs en engineering-teams.", useCase: "Softwareontwikkeling en code reviews versnellen.", url: "https://github.com/features/copilot", domain: "github.com", pricing: "€ 19 / dev / mnd (Business)", setupTime: "< 1 dag", firstStep: "Org-policy instellen en uitrollen naar 1 squad als pilot." },
  cursor: { name: "Cursor", category: "Ontwikkeling", description: "AI-first code editor met agent-modus.", useCase: "Hele features bouwen door AI op je codebase.", url: "https://cursor.com", domain: "cursor.com", pricing: "€ 20 / dev / mnd", setupTime: "< 1 dag", firstStep: "Senior dev pilot, baseline meten op story-throughput." },
  pinecone: { name: "Pinecone", category: "Infrastructuur", description: "Vector-database voor AI-kennisopslag en -opvraging.", useCase: "Interne copilots over je eigen data bouwen.", url: "https://pinecone.io", domain: "pinecone.io", pricing: "vanaf € 0 / serverless usage", setupTime: "2 weken", firstStep: "Kennisbank-bron kiezen en eerste 10K documenten indexeren." },

  // Forecasting / planning
  pecan: { name: "Pecan AI", category: "Predictive AI", description: "Predictive analytics zonder data-scientist.", useCase: "Demand forecasting, churn-voorspelling, lead scoring.", url: "https://pecan.ai", domain: "pecan.ai", pricing: "Op aanvraag (enterprise)", setupTime: "4-6 weken", firstStep: "1 use-case prioriteren (bv. churn) en historische data extracten." },
};

export type RadarPoint = { axis: string; value: number; benchmark: number };

export type ValueLineItem = {
  label: string;
  amount: number;
  formula: string;
  rationale: string;
};

export type ScoreDetail = {
  value: number;
  rationale: string;
  drivers: string[];
};

export type QuickWin = {
  title: string;
  effort: string;        // "30 minuten", "1 dag"
  impact: string;        // "€ 5K / jaar", "Direct meer leads"
  howTo: string;         // 1-2 zinnen concrete how
};

export type WeeklyPlanItem = {
  week: string;          // "Week 1"
  focus: string;         // "Foundation & quick wins"
  actions: string[];     // 2-4 concrete acties
};

export type SensitivityScenario = {
  label: "Worst case" | "Base case" | "Best case";
  multiplier: number;     // 0.5 / 1.0 / 1.6 etc
  estimatedValue: number;
  rationale: string;
};

/** A single editable numeric input that drives the value calculation. */
export type Assumption = {
  id: AssumptionId;
  label: string;          // human label, e.g. "FTE in bedrijf"
  value: number;          // current numeric value
  unit: "fte" | "eur" | "pct" | "count";
  confidence: "high" | "low";  // 'high' = derived from public data / explicit input, 'low' = estimated band
  source: string;         // e.g. "Geschat uit team-grootte band 11–50"
  min: number;
  max: number;
  step?: number;
};

export type AssumptionId =
  | "fte"
  | "fteCost"
  | "automatableShare"
  | "revenue"
  | "revenueUpliftPct"
  | "customers"
  | "customerValue"
  | "churn"
  | "churnRecoveryPct"
  | "stackCount";

export type AuditResult = {
  readinessScore: number;
  automationScore: number;
  impactScore: number;
  scoreDetails: {
    readiness: ScoreDetail;
    automation: ScoreDetail;
    impact: ScoreDetail;
  };
  estimatedAnnualValue: number;
  valueBreakdown: {
    laborSavings: number;
    revenueUplift: number;
    retentionGain: number;
    efficiencyGain: number;
  };
  /** Transparent line-items behind the headline number. */
  valueLineItems: ValueLineItem[];
  /** Editable numeric inputs that drive the value calculation client-side. */
  assumptions: Assumption[];
  summary: string;
  roadmap: { phase: string; title: string; description: string }[];
  tools: ToolRec[];
  radar: RadarPoint[];
  /** Direct uitvoerbare quick wins voor deze week. */
  quickWins: QuickWin[];
  /** 90-dagen weekplan met concrete acties. */
  weeklyPlan: WeeklyPlanItem[];
  /** Worst / base / best case ROI scenario's. */
  sensitivity: SensitivityScenario[];
  /** QA-notes from deterministic overrides (e.g. teamgrootte aangepast door site-detectie). */
  qaNotes?: string[];
};

/** Re-export — concrete shape lives in site-signals.server.ts but the type
 *  is duplicated here so audit.ts blijft pure (geen server-only imports). */
export type SiteSignalsLite = {
  detectedTech: string[];
  techMaturityScore: number;
  estimatedTeamSize?: number;
  estimatedCustomerVolume?: "low" | "medium" | "high";
  hasOpenRoles: boolean;
  openRoleCategories: string[];
  pricingDetected: boolean;
  pricePoints: number[];
  internationalReach: string[];
  contentVelocity: "none" | "low" | "medium" | "high";
  signalConfidence: number;
};

/**
 * Pure recompute: given the 10 editable assumptions, return the headline value,
 * breakdown, line-items and ±25% confidence band. Used by both the server
 * (initial render) and the client (when the user edits a variable).
 */
export type ValueModel = {
  estimatedAnnualValue: number;
  valueBreakdown: {
    laborSavings: number;
    revenueUplift: number;
    retentionGain: number;
    efficiencyGain: number;
  };
  valueLineItems: ValueLineItem[];
  /** ±25% confidence band around the headline number. */
  band: { low: number; high: number };
};

const _fmt = (n: number) => `€ ${Math.round(n).toLocaleString("nl-NL")}`;

export function recomputeValueModel(values: Record<AssumptionId, number>): ValueModel {
  const fte = values.fte;
  const fteCost = values.fteCost;
  const automatableShare = values.automatableShare;
  const revenue = values.revenue;
  const revenueUpliftPct = values.revenueUpliftPct;
  const customers = values.customers;
  const customerValue = values.customerValue;
  const churn = values.churn;
  const churnRecoveryPct = values.churnRecoveryPct;
  const stackCount = values.stackCount;

  const laborSavings = Math.round(fte * fteCost * automatableShare);
  const revenueUplift = Math.round(revenue * revenueUpliftPct);
  const retentionPct = churn * churnRecoveryPct;
  const retentionGain = Math.round(customers * customerValue * retentionPct);
  const efficiencyGain = Math.round(stackCount * 2_500);

  const total = Math.round((laborSavings + revenueUplift + retentionGain + efficiencyGain) / 1_000) * 1_000;

  const valueLineItems: ValueLineItem[] = [
    {
      label: "Loonbesparing",
      amount: laborSavings,
      formula: `${Math.round(fte)} FTE × ${_fmt(fteCost)} × ${(automatableShare * 100).toFixed(0)}% automatiseerbaar`,
      rationale: `Loaded jaarkost per FTE × deel dat AI/automatisering kan wegnemen.`,
    },
    {
      label: "Omzet-uplift",
      amount: revenueUplift,
      formula: `${_fmt(revenue)} jaaromzet × ${(revenueUpliftPct * 100).toFixed(1)}% uplift`,
      rationale: `Extra omzet via betere conversie, AI-outbound en upsell.`,
    },
    {
      label: "Retentie-winst",
      amount: retentionGain,
      formula: `${Math.round(customers).toLocaleString("nl-NL")} klanten × ${_fmt(customerValue)} × ${(retentionPct * 100).toFixed(2)}% (${(churnRecoveryPct * 100).toFixed(0)}% van ${(churn * 100).toFixed(1)}% churn)`,
      rationale: `Deel van de jaarlijkse churn dat herstelbaar is via 24/7 AI support en proactieve outreach.`,
    },
    {
      label: "Tooling-efficiëntie",
      amount: efficiencyGain,
      formula: `${Math.round(stackCount)} bestaande tools × € 2.500 koppel-winst`,
      rationale: `Bestaande stack koppelen via n8n / Make levert kleine maar zekere winst per tool.`,
    },
  ];

  return {
    estimatedAnnualValue: total,
    valueBreakdown: { laborSavings, revenueUplift, retentionGain, efficiencyGain },
    valueLineItems,
    band: {
      low: Math.round((total * 0.75) / 1_000) * 1_000,
      high: Math.round((total * 1.25) / 1_000) * 1_000,
    },
  };
}

const SIZE_FTE: Record<string, number> = {
  "1–10": 5,
  "11–50": 25,
  "51–200": 100,
  "201–1000": 500,
  "1000+": 1500,
};

const REV_MID: Record<string, number> = {
  "< € 100K": 60_000,
  "€ 100K – € 500K": 300_000,
  "€ 500K – € 2M": 1_200_000,
  "€ 2M – € 10M": 6_000_000,
  "€ 10M+": 20_000_000,
};

const CUSTOMER_VALUE_MID: Record<string, number> = {
  "< € 100": 60,
  "€ 100 – € 500": 300,
  "€ 500 – € 2.500": 1_500,
  "€ 2.500 – € 10K": 6_000,
  "€ 10K+": 20_000,
};

const CUSTOMERS_MID: Record<string, number> = {
  "< 50": 25,
  "50 – 250": 150,
  "250 – 1.000": 600,
  "1.000 – 10.000": 5_000,
  "10.000+": 25_000,
};

/** Verrijk tool met zijn slug (DB-key) zodat de UI kan linken naar /tools/$slug. */
function withSlug(slug: string, t: ToolRec): ToolRec {
  return { ...t, slug };
}

/** Lookup helper voor de detailpagina. */
export function getToolBySlug(slug: string): (ToolRec & { detail?: ToolDetail }) | null {
  const t = TOOL_DB[slug];
  if (!t) return null;
  return { ...t, slug, detail: TOOL_DETAILS[slug] };
}

function matchTools(a: AuditAnswers): ToolRec[] {
  const picks: string[] = [];
  const pains = new Set(a.painPoints);
  const goals = new Set(a.goals);
  const stack = new Set(a.techStack);

  if (pains.has("Repetitief handwerk")) picks.push("n8n", "make");
  if (pains.has("Trage klantenservice") || goals.has("Klantbeleving verbeteren")) {
    picks.push("vapi", "intercom", "chatbase");
  }
  if (pains.has("Lead generatie") || goals.has("Omzet verhogen")) {
    picks.push("instantly", "clay", "hubspot");
  }
  if (pains.has("Administratie & facturatie")) picks.push("klippa", "ramp");
  if (pains.has("Content creatie kost te veel tijd")) picks.push("midjourney", "runway", "descript");
  if (pains.has("Data verspreid over systemen")) picks.push("pinecone", "n8n");
  if (pains.has("Forecasting & planning")) picks.push("pecan", "perplexity");
  if (stack.has("Notion")) picks.push("notionai");
  if (stack.has("Eigen software")) picks.push("github", "cursor");
  if (goals.has("Productiviteit medewerkers")) picks.push("notionai", "zapier");
  if (goals.has("Sneller beslissingen nemen")) picks.push("perplexity");

  picks.push("openai", "claude");

  const seen = new Set<string>();
  const out: ToolRec[] = [];
  for (const slug of picks) {
    if (seen.has(slug)) continue;
    const t = TOOL_DB[slug];
    if (!t) continue;
    seen.add(slug);
    out.push(withSlug(slug, t));
  }
  return out.slice(0, 9);
}

const fmt = (n: number) => `€ ${Math.round(n).toLocaleString("nl-NL")}`;

/**
 * Deterministic, transparent value calculation. Goal-weighted: the user's
 * primary goals shape WHERE the value comes from. If they ask for more
 * revenue, revenue-uplift dominates. If they ask for cost cuts, labor
 * savings dominate.
 */
export function analyze(a: AuditAnswers, siteSignals?: SiteSignalsLite): AuditResult {
  const qaNotes: string[] = [];
  const sizeNum = Number(a.size);
  const fteFromBand = Number.isFinite(sizeNum) && sizeNum > 0 ? sizeNum : (SIZE_FTE[a.size] ?? 10);
  let fte = fteFromBand;
  const userProvidedExactSize = Number.isFinite(sizeNum) && sizeNum > 0;
  if (!userProvidedExactSize && siteSignals?.estimatedTeamSize && siteSignals.estimatedTeamSize > 0) {
    const deviation = Math.abs(siteSignals.estimatedTeamSize - fteFromBand) / Math.max(fteFromBand, 1);
    if (deviation > 0.5) {
      fte = siteSignals.estimatedTeamSize;
      qaNotes.push(`Team-grootte afgeleid van team-pagina (gedetecteerd: ${siteSignals.estimatedTeamSize}).`);
    }
  }
  const revenue = REV_MID[a.revenue] ?? 200_000;
  let customerValue = CUSTOMER_VALUE_MID[a.customerValue] ?? 500;
  if ((!a.customerValue || a.customerValue === "Onbekend") && siteSignals?.pricePoints?.length) {
    const sorted = [...siteSignals.pricePoints].sort((x, y) => x - y);
    const median = sorted[Math.floor(sorted.length / 2)];
    customerValue = Math.round(median * 12);
    qaNotes.push(`Klantwaarde geschat op basis van prijspagina (mediaan € ${median}/mnd × 12 = € ${customerValue}/jr).`);
  }
  const customers = CUSTOMERS_MID[a.customersPerYear] ?? 100;
  const painCount = a.painPoints.length;
  const goalCount = a.goals.length;
  const stackCount = a.techStack.length;
  const pains = new Set(a.painPoints);
  const goals = new Set(a.goals);

  // ----- FOLLOW-UP FINANCIALS (override defaults waar opgegeven) -----
  const HOURLY_MID: Record<string, number> = {
    "< € 30": 25, "€ 30 – € 50": 40, "€ 50 – € 80": 65, "€ 80 – € 120": 100, "> € 120": 140,
  };
  const hourlyCost = a.avgHourlyCost ? HOURLY_MID[a.avgHourlyCost] : null;
  // Loaded yearly cost ~ 1600 productieve uren × uurloon (NL benchmark) — pak hourly als beschikbaar.
  const FTE_COST = hourlyCost ? Math.round(hourlyCost * 1600) : 55_000;

  const MARGIN_MID: Record<string, number> = {
    "< 20%": 0.15, "20 – 40%": 0.30, "40 – 60%": 0.50, "60 – 80%": 0.70, "> 80%": 0.85,
  };
  const grossMargin = a.grossMargin ? MARGIN_MID[a.grossMargin] : 0.45;

  const CHURN_MID: Record<string, number> = {
    "< 5%": 0.04, "5 – 10%": 0.075, "10 – 20%": 0.15, "20 – 40%": 0.30, "> 40%": 0.50,
  };
  const churn = a.churnRate ? (CHURN_MID[a.churnRate] ?? 0.10) : 0.10;

  // ----- LABOR SAVINGS share (goal-weighted) -----
  let automatableShare = Math.min(0.06 * painCount, 0.30);
  const wantsCostCut = goals.has("Operationele kosten verlagen");
  const wantsProductivity = goals.has("Productiviteit medewerkers");
  if (wantsCostCut) automatableShare += 0.08;
  if (wantsProductivity) automatableShare += 0.05;
  if (!wantsCostCut && !wantsProductivity) automatableShare *= 0.55;
  automatableShare = Math.min(Math.max(automatableShare, 0.03), 0.40);

  // ----- REVENUE UPLIFT pct (goal-weighted) -----
  let revenueUpliftPct = Math.min(0.01 * goalCount, 0.04);
  const wantsRevenue = goals.has("Omzet verhogen");
  const wantsLeads = pains.has("Lead generatie");
  if (wantsRevenue) revenueUpliftPct += 0.05;
  if (wantsLeads) revenueUpliftPct += 0.025;
  if (!wantsRevenue && !wantsLeads) revenueUpliftPct *= 0.4;
  // OVERRIDE: site-detected sales hiring → bump uplift starting point.
  if (siteSignals?.hasOpenRoles && siteSignals.openRoleCategories.includes("sales")) {
    revenueUpliftPct += 0.015;
    qaNotes.push("Vacature(s) sales gevonden op website → +1.5pp omzet-uplift starthypothese.");
  }
  revenueUpliftPct = Math.min(Math.max(revenueUpliftPct, 0.005), 0.10);

  // ----- RETENTION recovery pct -----
  let churnRecoveryPct = 0.15;
  if (goals.has("Klantbeleving verbeteren")) churnRecoveryPct += 0.10;
  if (pains.has("Trage klantenservice")) churnRecoveryPct += 0.08;
  if (!goals.has("Klantbeleving verbeteren") && !pains.has("Trage klantenservice")) churnRecoveryPct = 0.10;

  // ----- Compute via shared pure function so client-side overrides use the same math -----
  const valueModel = recomputeValueModel({
    fte,
    fteCost: FTE_COST,
    automatableShare,
    revenue,
    revenueUpliftPct,
    customers,
    customerValue,
    churn,
    churnRecoveryPct,
    stackCount,
  });
  const { laborSavings, revenueUplift, retentionGain, efficiencyGain } = valueModel.valueBreakdown;
  const estimatedAnnualValue = valueModel.estimatedAnnualValue;

  // ----- SCORES with rationale -----
  // Quick-check overrides: if quiz answers present, base scores on those for higher fidelity.
  const hasQuiz = !!(a.dataSystems?.length || typeof a.processMaturity === "number" || a.biggestTimeWaster || a.decisionPain || a.maxToolBudget);

  // READINESS
  let readinessScore: number;
  let readinessDrivers: string[];
  if (hasQuiz) {
    const ds = a.dataSystems || [];
    let r = 30;
    if (ds.includes("CRM (HubSpot, Salesforce, Pipedrive…)")) r += 25;
    if (ds.includes("Eigen database / tool")) r += 18;
    if (ds.includes("Excel / Google Sheets")) r += 8;
    if (ds.includes("Email inbox is onze CRM")) r -= 5;
    if (ds.includes("Geen idee / geen systeem")) r -= 10;
    if (typeof a.processMaturity === "number") r += Math.round((a.processMaturity / 100) * 30);
    if (a.website) r += 5;
    readinessScore = Math.min(Math.max(r, 15), 95);
    readinessDrivers = [
      ds.length ? `Klantdata-systemen: ${ds.slice(0, 2).join(", ")}${ds.length > 2 ? "…" : ""}` : "Geen klantdata-systemen opgegeven",
      typeof a.processMaturity === "number"
        ? `Proces-documentatie: ${a.processMaturity}/100 (${a.processMaturity < 30 ? "zwak" : a.processMaturity < 70 ? "gemiddeld" : "sterk"})`
        : "Proces-volwassenheid niet opgegeven",
      a.website ? `+5 pt voor publieke website` : `Geen website opgegeven`,
    ];
  } else {
    const readinessRaw = 30 + stackCount * 6 + (a.size ? 8 : 0) + (a.website ? 6 : 0) + (a.budget && a.budget !== "Nog onbekend" ? 8 : 0);
    readinessScore = Math.min(Math.max(readinessRaw, 20), 95);
    readinessDrivers = [
      `+${stackCount * 6} pt voor ${stackCount} bestaande tools in de stack`,
      a.website ? `+6 pt voor publieke website (geanalyseerd)` : `+0 pt — geen website opgegeven`,
      a.budget && a.budget !== "Nog onbekend" ? `+8 pt voor concreet budget (${a.budget})` : `+0 pt — budget nog onbekend`,
    ];
  }

  // OVERRIDE: mature data-tooling detected on website → +10 readiness.
  if (siteSignals?.detectedTech?.some((t) => ["Shopify", "HubSpot", "Salesforce"].includes(t))) {
    const before = readinessScore;
    readinessScore = Math.min(readinessScore + 10, 98);
    qaNotes.push(`Volwassen data-stack gedetecteerd (${siteSignals.detectedTech.filter((t) => ["Shopify","HubSpot","Salesforce"].includes(t)).join(", ")}) → readiness +10 (${before} → ${readinessScore}).`);
  }
  let automationScore: number;
  let automationDrivers: string[];
  if (hasQuiz) {
    let auto = 40;
    if (a.biggestTimeWaster && a.biggestTimeWaster.trim().length > 10) auto += 25;
    if (a.decisionPain) auto += 18;
    auto += painCount * 4;
    automationScore = Math.min(auto, 95);
    automationDrivers = [
      a.biggestTimeWaster ? `Concrete tijdvreter benoemd → directe automatiseringskans` : `Geen specifieke tijdvreter opgegeven`,
      a.decisionPain ? `Beslissing-pijn: "${a.decisionPain}"` : `Geen terugkerende beslissingspijn opgegeven`,
      `+${painCount * 4} pt voor ${painCount} pijnpunten`,
    ];
  } else {
    const automationRaw = 35 + painCount * 7 + (pains.has("Repetitief handwerk") ? 10 : 0) + (stackCount >= 3 ? 5 : 0);
    automationScore = Math.min(automationRaw, 95);
    automationDrivers = [
      `+${painCount * 7} pt voor ${painCount} aangegeven pijnpunten`,
      pains.has("Repetitief handwerk") ? `+10 pt — repetitief handwerk staat top-of-mind` : `Geen expliciete repetitieve last opgegeven`,
      stackCount >= 3 ? `+5 pt — voldoende systemen om tussen te koppelen` : `Beperkte stack om aan te koppelen`,
    ];
  }

  // IMPACT
  const impactRaw = 35 + goalCount * 7 + Math.min(Math.log10(Math.max(revenue, 10_000)) * 4, 20);
  let impactScore = Math.min(Math.round(impactRaw), 98);
  let impactBudgetNote = "";
  if (a.maxToolBudget) {
    if (a.maxToolBudget === "€ 2.000+") { impactScore = Math.min(impactScore + 6, 98); impactBudgetNote = ` Budget-bereidheid > € 2.000/mnd verhoogt haalbare impact.`; }
    else if (a.maxToolBudget === "< € 100") { impactScore = Math.max(impactScore - 8, 25); impactBudgetNote = ` Budget < € 100/mnd beperkt tool-keuze tot lichte stack.`; }
  }

  const scoreDetails = {
    readiness: {
      value: readinessScore,
      rationale: hasQuiz
        ? `Op basis van jullie klantdata-systemen en hoe goed processen op papier staan.`
        : `Gebaseerd op huidige stack (${stackCount} tools), team-grootte (${a.size || "?"}), website-aanwezigheid en duidelijkheid van budget.`,
      drivers: readinessDrivers,
    },
    automation: {
      value: automationScore,
      rationale: hasQuiz
        ? `Berekend uit jullie eigen benoemde tijdvreter en beslissingspijn — sterkste signaal voor automatiseerbaarheid.`
        : `Berekend uit het aantal pijnpunten (${painCount}) en of repetitief handwerk expliciet genoemd is.`,
      drivers: automationDrivers,
    },
    impact: {
      value: impactScore,
      rationale: `Gewogen uit aantal doelen (${goalCount}) en bedrijfsomvang in omzet (${a.revenue || "?"}).${impactBudgetNote}`,
      drivers: [
        `+${goalCount * 7} pt voor ${goalCount} concrete doelen`,
        `+${Math.round(Math.min(Math.log10(Math.max(revenue, 10_000)) * 4, 20))} pt op basis van omzetschaal`,
        wantsRevenue ? `Doel "Omzet verhogen" — hoge ROI hefboom op revenue-side` : `Focus ligt op interne efficiëntie`,
      ],
    },
  };

  // ----- VALUE LINE ITEMS — start from pure model, then enrich rationale with audit context -----
  const valueLineItems: ValueLineItem[] = valueModel.valueLineItems.map((it) => {
    if (it.label === "Loonbesparing") {
      return { ...it, rationale: wantsCostCut || wantsProductivity
        ? `Doel "${wantsCostCut ? "kosten verlagen" : "productiviteit"}" verhoogt het automatiseerbare aandeel.`
        : `Doelen liggen niet primair op cost-cutting — aandeel bewust gedempt.` };
    }
    if (it.label === "Omzet-uplift") {
      return { ...it, rationale: wantsRevenue
        ? `Doel "Omzet verhogen" geeft +5 pp uplift via betere lead-conversie en outbound (Instantly.ai / Clay).`
        : wantsLeads
          ? `Pijnpunt "Lead generatie" geeft +2.5 pp uplift via AI-outbound.`
          : `Geen revenue-doel opgegeven — voorzichtige schatting.` };
    }
    if (it.label === "Retentie-winst") {
      return { ...it, rationale: a.churnRate
        ? `Churn-input "${a.churnRate}" + ${(churnRecoveryPct * 100).toFixed(0)}% recoverable via AI voice/chat (Vapi, Intercom Fin).`
        : `Geen churn-input opgegeven — branche-default van 10% jaarlijkse churn gebruikt.` };
    }
    return it;
  });

  // ----- EDITABLE ASSUMPTIONS — let the user correct any of the 10 inputs that drive value -----
  const sizeKnown = !!a.size;
  const revenueKnown = !!a.revenue;
  const customersKnown = !!a.customersPerYear;
  const cvKnown = !!a.customerValue;
  const hourlyKnown = !!a.avgHourlyCost;
  const churnKnown = !!a.churnRate;
  const stackKnown = a.techStack.length > 0;

  const assumptions: Assumption[] = [
    { id: "fte", label: "FTE in bedrijf", value: fte, unit: "fte", confidence: sizeKnown ? "high" : "low",
      source: sizeKnown ? `Afgeleid uit team-grootte band ${a.size}` : "Geschat — vul je eigen aantal in voor een preciezere uitkomst",
      min: 1, max: 5000, step: 1 },
    { id: "fteCost", label: "Loaded jaarkost / FTE", value: FTE_COST, unit: "eur", confidence: hourlyKnown ? "high" : "low",
      source: hourlyKnown ? `Uurloon "${a.avgHourlyCost}" × 1.600 productieve uren` : "NL-benchmark € 55K — pas aan voor je eigen uurtarief",
      min: 20_000, max: 200_000, step: 1_000 },
    { id: "automatableShare", label: "Automatiseerbaar deel van werk", value: automatableShare, unit: "pct", confidence: "low",
      source: `Afgeleid uit ${painCount} pijnpunten + doelen — typische bandbreedte 5–35%`,
      min: 0.02, max: 0.50, step: 0.01 },
    { id: "revenue", label: "Jaaromzet", value: revenue, unit: "eur", confidence: revenueKnown ? "high" : "low",
      source: revenueKnown ? `Mediaan van band ${a.revenue}` : "Branche-default — vul je eigen omzet in",
      min: 50_000, max: 100_000_000, step: 10_000 },
    { id: "revenueUpliftPct", label: "Verwachte omzet-uplift", value: revenueUpliftPct, unit: "pct", confidence: "low",
      source: `Op basis van ${goalCount} doelen + lead-pijnpunten — typisch 1–8%`,
      min: 0.005, max: 0.15, step: 0.005 },
    { id: "customers", label: "Klanten per jaar", value: customers, unit: "count", confidence: customersKnown ? "high" : "low",
      source: customersKnown ? `Mediaan van band ${a.customersPerYear}` : "Geschat — pas aan voor preciezere retentie-rekensom",
      min: 1, max: 1_000_000, step: 1 },
    { id: "customerValue", label: "Gemiddelde klantwaarde / jaar", value: customerValue, unit: "eur", confidence: cvKnown ? "high" : "low",
      source: cvKnown ? `Mediaan van band ${a.customerValue}` : "Geschat — vaak makkelijk te bepalen uit boekhouding",
      min: 10, max: 1_000_000, step: 10 },
    { id: "churn", label: "Jaarlijkse churn", value: churn, unit: "pct", confidence: churnKnown ? "high" : "low",
      source: churnKnown ? `Mediaan van band ${a.churnRate}` : "Branche-default 10% — past in 30 sec aan",
      min: 0.005, max: 0.80, step: 0.005 },
    { id: "churnRecoveryPct", label: "Deel churn herstelbaar door AI", value: churnRecoveryPct, unit: "pct", confidence: "low",
      source: "Schatting op basis van CX-focus in doelen — typisch 10–35%",
      min: 0.05, max: 0.50, step: 0.01 },
    { id: "stackCount", label: "Bestaande tools in stack", value: stackCount, unit: "count", confidence: stackKnown ? "high" : "low",
      source: stackKnown ? `${stackCount} tools genoemd in audit` : "Geen tools opgegeven — elke koppel-winst telt mee",
      min: 0, max: 50, step: 1 },
  ];

  const company = a.companyName || "jouw organisatie";
  const roadmap = [
    { phase: "Fase 1 · 0–30 dagen", title: "Foundation & Quick Wins", description: `Veilige ChatGPT/Claude workspace voor ${company} uitrollen en het team trainen op prompt fundamentals. Identificeer 3 repetitieve taken om eerst te automatiseren.` },
    { phase: "Fase 2 · 1–3 maanden", title: "Workflow Automatisering", description: `Bestaande tools (${a.techStack.slice(0, 3).join(", ") || "core stack"}) koppelen met no-code AI-automatiseringen via n8n of Make. Pilot een AI-assistent gericht op de grootste pijn: ${a.painPoints[0] || "operationele frictie"}.` },
    { phase: "Fase 3 · 3–6 maanden", title: "Custom AI Capability", description: `Bouw een knowledge-grounded copilot over de eigen data van ${company} met vector search. Definieer KPI's en schaal op naar andere afdelingen.` },
    { phase: "Fase 4 · 6–12 maanden", title: "AI als Concurrentievoordeel", description: `Embed AI in het product van ${company}, meet ROI en richt een klein AI Center of Excellence in voor continue innovatie.` },
  ];

  const radar: RadarPoint[] = [
    { axis: "Data maturity", value: Math.min(40 + stackCount * 6, 95), benchmark: 55 },
    { axis: "Automation", value: automationScore, benchmark: 50 },
    { axis: "Customer experience", value: Math.min(45 + (pains.has("Trage klantenservice") ? 25 : 10) + goalCount * 4, 95), benchmark: 60 },
    { axis: "Revenue ops", value: Math.min(35 + (pains.has("Lead generatie") ? 30 : 10) + goalCount * 5, 95), benchmark: 50 },
    { axis: "Talent & skills", value: Math.min(30 + stackCount * 5, 90), benchmark: 55 },
    { axis: "AI readiness", value: readinessScore, benchmark: 60 },
  ];

  const summary = `${company} kan op basis van het ingevulde profiel realistisch € ${estimatedAnnualValue.toLocaleString("nl-NL")} aan jaarlijkse waarde unlocken — gespreid over loonbesparing, omzet-uplift en hogere retentie. Onderstaand rapport laat exact zien hoe.`;

  const topPain = a.painPoints[0] || "operationele frictie";
  const topGoal = a.goals[0] || "groei";

  const timeWasterQuote = a.biggestTimeWaster?.trim();
  const quickWins: QuickWin[] = [
    timeWasterQuote
      ? {
          title: `Pak jullie #1 tijdvreter aan`,
          effort: "1-2 dagen",
          impact: `± ${fmt(fte * 400)} / jaar tijdwinst`,
          howTo: `Jullie noemden zelf: "${timeWasterQuote}". Bouw hier in week 1 een Make.com- of n8n-flow voor — vaak in 2 dagen werkend, en vanaf dag 3 levert het al tijd op.`,
        }
      : { title: `ChatGPT Team uitrollen voor ${company}`, effort: "1 dag", impact: `± ${fmt(fte * 200)} / jaar tijdwinst`, howTo: "Activeer ChatGPT Team, nodig kernteam uit en maak 3 prompt-templates voor de meest voorkomende taken." },
    { title: `1 repetitieve workflow automatiseren in Make.com`, effort: "halve dag", impact: `${fmt(8000)} / jaar`, howTo: `Pak "${topPain}" en bouw 1 scenario dat de hand-off tussen 2 tools wegneemt.` },
    a.decisionPain
      ? { title: `Beslissings-copilot voor "${a.decisionPain}"`, effort: "1 week", impact: "Snellere & consistentere beslissingen", howTo: `Bouw een GPT met jullie historische data zodat het team in seconden een gemotiveerd voorstel krijgt voor "${a.decisionPain.toLowerCase()}".` }
      : { title: `AI chatbot op contactpagina (Chatbase)`, effort: "2 uur", impact: "10–30% meer gekwalificeerde leads", howTo: "Upload je website + FAQ en plaats het widget. Direct meer conversie zonder devs." },
  ];

  // OVERRIDE: low/no content velocity + revenue goal → content-engine quick win.
  if (
    siteSignals &&
    (siteSignals.contentVelocity === "none" || siteSignals.contentVelocity === "low") &&
    goals.has("Omzet verhogen")
  ) {
    quickWins.push({
      title: `Content-engine met AI voor ${company}`,
      effort: "1 week",
      impact: "3-5× publicatie-frequentie zonder extra hires",
      howTo: `We zagen weinig recente content op jullie site. Zet een ChatGPT/Claude-flow op die per week 3 blog-drafts + 5 social variaties produceert in jullie tone-of-voice.`,
    });
    qaNotes.push(`Content-velocity gedetecteerd: ${siteSignals.contentVelocity} → quick win 'Content-engine' toegevoegd.`);
  }

  const weeklyPlan: WeeklyPlanItem[] = [
    { week: "Week 1", focus: "Foundation", actions: [`AI-policy + Team workspace voor ${company}`, "Audit van top-5 repetitieve taken", "Kies 1 quick win uit lijst hierboven"] },
    { week: "Week 2-3", focus: "Eerste automatisering", actions: [`Bouw n8n/Make workflow voor "${topPain}"`, "Meet baseline tijdwinst", "Train team op gebruik"] },
    { week: "Week 4-6", focus: "Klantgerichte AI", actions: [pains.has("Trage klantenservice") ? "Vapi pilot voor inbound calls" : "Chatbase op website", "Meet response-tijd & conversie", "Iterate op prompts"] },
    { week: "Week 7-9", focus: `Schalen op "${topGoal}"`, actions: [wantsRevenue ? "Instantly.ai outbound campagne live" : "Tweede workflow uitrollen", "KPI dashboard opzetten", "Adoptie-check team"] },
    { week: "Week 10-13", focus: "Verankeren & uitbreiden", actions: ["Resultaten meten vs baseline", "Roadmap voor Q2 vaststellen", "Budget aanvraag voor schaal"] },
  ];

  const sensitivity: SensitivityScenario[] = [
    { label: "Worst case", multiplier: 0.5, estimatedValue: Math.round(estimatedAnnualValue * 0.5 / 1000) * 1000, rationale: "Trage adoptie, slechts 50% van potentieel gerealiseerd in jaar 1." },
    { label: "Base case", multiplier: 1.0, estimatedValue: estimatedAnnualValue, rationale: "Verwachte uitkomst bij gemiddelde adoptie en uitvoering volgens roadmap." },
    { label: "Best case", multiplier: 1.6, estimatedValue: Math.round(estimatedAnnualValue * 1.6 / 1000) * 1000, rationale: "Snelle adoptie + uitbreiding naar aangrenzende processen, marge-effect via gross margin van " + (grossMargin * 100).toFixed(0) + "%." },
  ];

  return {
    readinessScore: Math.round(readinessScore),
    automationScore: Math.round(automationScore),
    impactScore: Math.round(impactScore),
    scoreDetails,
    estimatedAnnualValue,
    valueBreakdown: { laborSavings, revenueUplift, retentionGain, efficiencyGain },
    valueLineItems,
    assumptions,
    summary,
    roadmap,
    tools: matchTools(a),
    radar,
    quickWins,
    weeklyPlan,
    sensitivity,
    qaNotes: qaNotes.length ? qaNotes : undefined,
  };
}
