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

  // ----- Deeper financial questions -----
  grossMargin?: string;        // gross margin band
  avgHourlyCost?: string;      // average hourly cost (incl. employer charges)
  churnRate?: string;          // annual churn

  // ----- Follow-up questions per pain point -----
  customerServiceVolume?: string;  // calls/tickets per week
  customerServiceChannels?: string[]; // phone, email, chat, whatsapp
  repetitiveHoursPerWeek?: string; // FTE hours per week on repetitive work
  invoicesPerMonth?: string;       // number of invoices / receipts per month
  contentPiecesPerMonth?: string;  // number of content pieces per month
  leadsPerMonth?: string;          // current leads per month
  conversionRate?: string;         // current conversion %

  // ----- Follow-up questions per goal -----
  salesCycleLength?: string;       // average sales cycle
  primaryChannel?: string;         // primary acquisition channel

  // ----- Industry-specific questions -----
  ecommercePlatform?: string;      // Shopify, WooCommerce, Magento ...
  serviceModel?: string;           // project-based, retainer, SaaS
  manufacturingType?: string;      // make-to-stock, make-to-order, custom

  // ----- Quick-check 5 questions (from /check flow) -----
  /** Q1 — which systems for customer data. */
  dataSystems?: string[];
  /** Q2 — process documentation maturity 0-100. */
  processMaturity?: number;
  /** Q3 — open input biggest time waster, max 200 chars. */
  biggestTimeWaster?: string;
  /** Q4 — recurring decision pain. */
  decisionPain?: string;
  /** Q5 — maximum budget per month for AI tool. */
  maxToolBudget?: string;
};

export const DATA_SYSTEMS = [
  "CRM (HubSpot, Salesforce, Pipedrive…)",
  "Excel / Google Sheets",
  "Own database / tool",
  "Email inbox is our CRM",
  "No idea / no system",
];

export const DECISION_PAINS = [
  "Which leads do we call first",
  "What price do we charge this customer",
  "What inventory do we order",
  "What content do we create",
  "Which employee do we assign to what",
];

export const MAX_TOOL_BUDGETS = [
  "< € 100",
  "€ 100 – € 500",
  "€ 500 – € 2,000",
  "€ 2,000+",
  "No idea, depends on ROI",
];

export const INDUSTRIES = [
  "Retail & E-commerce",
  "Finance & Insurance",
  "Healthcare",
  "Manufacturing & Industry",
  "Business Services",
  "Education",
  "Marketing & Media",
  "Logistics & Transport",
  "Construction & Real Estate",
  "Hospitality & Tourism",
  "Bakery / Butcher / Fresh Specialist",
  "Installation (plumber, electrician, HVAC)",
  "Auto & Garage",
  "Cleaning & Facility",
  "IT & Software",
  "Cybersecurity",
  "Legal & Notary",
  "Accounting & Bookkeeping",
  "Architecture & Design",
  "Beauty & Wellness",
  "Sport & Fitness",
  "Agriculture / Horticulture",
  "Non-profit / Foundation",
  "Government / Public",
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
  "Immediately, within 30 days",
  "Coming quarter",
  "Next 6 months",
  "Exploring, no rush",
];

export const TECH_STACK = [
  "Microsoft 365",
  "Google Workspace",
  "Slack",
  "Notion",
  "Salesforce",
  "HubSpot",
  "SAP / ERP",
  "Custom software",
  "Shopify",
  "WordPress",
];

export const PAIN_POINTS = [
  "Repetitive work",
  "Slow customer service",
  "Data scattered across systems",
  "Content creation takes too much time",
  "Hard to find talent",
  "Forecasting & planning",
  "Quality control",
  "Lead generation",
  "Administration & invoicing",
];

export const GOALS = [
  "Reduce operational costs",
  "Increase revenue",
  "Improve customer experience",
  "Make decisions faster",
  "Innovate product",
  "Employee productivity",
];

export const BUDGETS = ["< € 1K / mo", "€ 1K – € 5K", "€ 5K – € 20K", "€ 20K+", "Not yet known"];

export const CUSTOMER_VALUES = [
  "< € 100",
  "€ 100 – € 500",
  "€ 500 – € 2,500",
  "€ 2,500 – € 10K",
  "€ 10K+",
];

export const CUSTOMERS_PER_YEAR = [
  "< 50",
  "50 – 250",
  "250 – 1,000",
  "1,000 – 10,000",
  "10,000+",
];

// ----- Deeper financial options -----
export const GROSS_MARGINS = ["< 20%", "20 – 40%", "40 – 60%", "60 – 80%", "> 80%"];
export const HOURLY_COSTS = ["< € 30", "€ 30 – € 50", "€ 50 – € 80", "€ 80 – € 120", "> € 120"];
export const CHURN_RATES = ["< 5%", "5 – 10%", "10 – 20%", "20 – 40%", "> 40%", "Unknown"];

// ----- Follow-up question options -----
export const CS_VOLUMES = ["< 25 / week", "25 – 100 / week", "100 – 500 / week", "500 – 2,000 / week", "> 2,000 / week"];
export const CS_CHANNELS = ["Phone", "Email", "Live chat", "WhatsApp", "Social DM", "Contact form"];
export const REPETITIVE_HOURS = ["< 5 hrs", "5 – 20 hrs", "20 – 60 hrs", "60 – 200 hrs", "> 200 hrs"];
export const INVOICE_VOLUMES = ["< 50 / mo", "50 – 250 / mo", "250 – 1,000 / mo", "> 1,000 / mo"];
export const CONTENT_VOLUMES = ["< 5 / mo", "5 – 20 / mo", "20 – 100 / mo", "> 100 / mo"];
export const LEAD_VOLUMES = ["< 25 / mo", "25 – 100 / mo", "100 – 500 / mo", "500 – 2,000 / mo", "> 2,000 / mo"];
export const CONVERSION_RATES = ["< 1%", "1 – 3%", "3 – 7%", "7 – 15%", "> 15%", "Unknown"];
export const SALES_CYCLES = ["< 1 week", "1 – 4 weeks", "1 – 3 months", "3 – 6 months", "> 6 months"];
export const PRIMARY_CHANNELS = ["Inbound / SEO", "Outbound / cold outreach", "Paid ads", "Referrals / partners", "Events / network", "Marketplace"];

// ----- Industry-specific -----
export const ECOMMERCE_PLATFORMS = ["Shopify", "WooCommerce", "Magento", "Lightspeed", "BigCommerce", "Custom build"];
export const SERVICE_MODELS = ["Project-based", "Retainer / subscription", "Hourly billing", "SaaS / product", "Mix"];
export const MANUFACTURING_TYPES = ["Make-to-stock", "Make-to-order", "Engineer-to-order", "Process / continuous"];

export type ToolRec = {
  /** URL-safe slug, equal to the TOOL_DB key. */
  slug?: string;
  name: string;
  category: string;
  description: string;
  useCase: string;
  url: string;
  /** Domain used to render the tool's favicon/logo (Clearbit / Google s2). */
  domain: string;
  /** Indicative price per month in EUR ranges. */
  pricing?: string;
  /** Average setup time to reach production value. */
  setupTime?: string;
  /** Concrete first step for implementation. */
  firstStep?: string;
};

/** Extra detail content for the tool detail page (per slug). */
export type ToolDetail = {
  /** Short tagline above the fold on the detail page. */
  tagline: string;
  /** 3-5 concrete use cases (bullets). */
  useCases: string[];
  /** Before / after comparison. */
  beforeAfter: { before: string; after: string }[];
  /** 4-6 concrete onboarding steps, in order. */
  steps: { title: string; detail: string }[];
  /** Optional — best for whom. */
  bestFor?: string;
  /** Optional — when not to choose this. */
  notFor?: string;
};

export const TOOL_DETAILS: Record<string, ToolDetail> = {
  openai: {
    tagline: "The fastest way to make your entire team more productive with AI.",
    useCases: [
      "Draft proposals, quotes and emails in your tone of voice",
      "Automatically summarize meeting recordings with action items",
      "Build internal copilots with GPTs on your own documents",
      "Generate marketing copy and ad variations at scale",
      "Analyze spreadsheets and data ad-hoc in plain English",
    ],
    beforeAfter: [
      { before: "2 hours per proposal written manually.", after: "15 minutes — AI delivers the first 80% based on previous wins." },
      { before: "Meetings are not recorded, action points disappear.", after: "Every meeting ends with a summary + tasks in Slack." },
      { before: "Marketing team produces 4 posts per week.", after: "12+ posts per week, varied by format and channel." },
    ],
    steps: [
      { title: "Activate ChatGPT Team", detail: "€ 25 / user / mo. Central workspace, data is not used for training." },
      { title: "Choose 3 use cases with the team", detail: "E.g. writing proposals, meeting summaries, client research. Start narrow." },
      { title: "Build custom GPTs", detail: "1 GPT per use case with instructions + upload 5 example docs." },
      { title: "Calibrate tone of voice", detail: "Upload 5 best previous proposals so output is immediately on-brand." },
      { title: "Weekly share-outs", detail: "10 min standup where the team shares best prompts — accelerates adoption." },
    ],
    bestFor: "Teams that want to experiment quickly without a developer.",
  },
  claude: {
    tagline: "The best model for long documents and sensitive analyses.",
    useCases: [
      "Read contracts and flag risks",
      "Summarize policy documents for management",
      "Search entire knowledge bases with natural questions",
      "Analyze tender documents against internal capabilities",
    ],
    beforeAfter: [
      { before: "Lawyer reads 40-page contract in 3 hours.", after: "Risks in bullets within 10 minutes — lawyer validates." },
      { before: "RFP response takes a week.", after: "First draft within a day thanks to precise document Q&A." },
    ],
    steps: [
      { title: "Open Claude Pro or Team account", detail: "200K context support — fits complete contracts." },
      { title: "Create a project per document stream", detail: "E.g. 'Purchase contracts', 'Policy', 'RFPs'." },
      { title: "Upload reference docs", detail: "Sample contracts + internal checklist as context." },
      { title: "Double-check first analyses", detail: "Validate first 10 outputs by an expert — calibrate prompts." },
    ],
    bestFor: "Legal, finance, compliance — anything with dense documents.",
  },
  n8n: {
    tagline: "Fully automate repetitive tasks between your tools.",
    useCases: [
      "Incoming email/invoice → bookkeeping without typing",
      "Web form → CRM → welcome email in one flow",
      "Automatically compile weekly reports",
      "Enrich tickets with customer context before they reach support",
      "Use AI steps for categorization or summarization",
    ],
    beforeAfter: [
      { before: "8 hours per week manually retyping invoices.", after: "30 min reviewing — workflow does the rest." },
      { before: "Lead fills out form, sits for 1 day.", after: "Lead gets personalized welcome email within 60 sec." },
    ],
    steps: [
      { title: "List top-3 repetitive actions", detail: "Ask the team: what do you do every week that's tedious?" },
      { title: "Start n8n cloud or self-hosted", detail: "Cloud is faster; self-hosted saves costs at volume." },
      { title: "Build first workflow for #1 task", detail: "Start narrow: 1 trigger, 3-4 steps. Test with real data." },
      { title: "Add error handling", detail: "Set up Slack notification on failures before going live." },
      { title: "Build workflows #2 and #3", detail: "Apply what you learned to the other 2 use cases." },
    ],
    bestFor: "SMBs with 5+ tools that don't communicate well.",
  },
  vapi: {
    tagline: "24/7 phone answering so no customer ever goes unanswered.",
    useCases: [
      "Catch incoming calls outside business hours + callback note",
      "Answer standard FAQ questions directly",
      "Appointment scheduler via phone",
      "Make outbound confirmations or reminders",
    ],
    beforeAfter: [
      { before: "20% of calls go to voicemail, half never call back.", after: "100% answered, structured lead data in CRM." },
      { before: "Receptionist lost 2 hrs/day to FAQ calls.", after: "AI agent handles 70% — receptionist works on complex matters." },
    ],
    steps: [
      { title: "Create FAQ script (10 questions)", detail: "Write out the 10 questions + ideal answers." },
      { title: "Vapi account + phone number", detail: "Twilio integration or port existing number." },
      { title: "Build agent + choose voice", detail: "ElevenLabs voice for a natural experience." },
      { title: "Set transfer rules", detail: "When to hand off to a human? E.g. angry customer detection or complex request." },
      { title: "Run parallel for 1 week", detail: "Alongside existing line — analyze transcripts daily." },
    ],
    bestFor: "Companies with >50 incoming calls/week.",
    notFor: "High-emotion conversations (e.g. funeral, care crises).",
  },
  intercom: {
    tagline: "Autonomously resolve 70% of support tickets, 24/7.",
    useCases: [
      "Answer first-line FAQ directly in chat & email",
      "Retrieve and personalize customer data",
      "Escalate tickets with full context to agent",
      "Multi-language support without extra team",
    ],
    beforeAfter: [
      { before: "Average 8 hours first response on email.", after: "8 sec — Fin answers and resolves immediately." },
      { before: "Support team of 5 for 1,000 tickets/week.", after: "Team of 2 handling only complex cases." },
    ],
    steps: [
      { title: "Get help center articles in order", detail: "Fin is only as good as your content. Top 30 questions up to date." },
      { title: "Train Fin on 100 old tickets", detail: "Show how you previously responded." },
      { title: "Set resolution-confidence threshold", detail: "Start at 80% — escalate everything below." },
      { title: "Weekly content review", detail: "Failed conversations → new help articles." },
    ],
    bestFor: "B2B SaaS with 500+ tickets/month.",
  },
  klippa: {
    tagline: "Fully automatic invoice processing and receipt booking.",
    useCases: [
      "Incoming invoices via mailbox → OCR → bookkeeping",
      "Expense declarations via app by employee",
      "Automatic VAT validation and ledger integration",
      "Approval workflow per cost center",
    ],
    beforeAfter: [
      { before: "Accountant manually types 200 invoices/mo (10 hrs).", after: "200 invoices automatically — 1 hour to validate." },
      { before: "Receipts get lost, VAT not reclaimed.", after: "Photo in app → immediately booked + VAT claimed." },
    ],
    steps: [
      { title: "Connect accounting package", detail: "Exact, AFAS, Twinfield, Snelstart, Yuki — all supported." },
      { title: "Activate mailbox for invoices", detail: "Suppliers email to invoices@yourcompany.com." },
      { title: "Run first 100 invoices through OCR", detail: "Train cost center mapping on real examples." },
      { title: "Set approval rules", detail: "E.g. > € 1,000 to manager, otherwise book directly." },
      { title: "Roll out employee app", detail: "Receipt app installation meeting of 15 min." },
    ],
    bestFor: "SMBs with 50+ invoices or 30+ expense claims per month.",
  },
  instantly: {
    tagline: "Hyper-personalized cold outreach on autopilot for more leads.",
    useCases: [
      "Unlimited mailboxes for scalable outbound",
      "Auto warm-up for 100% deliverability",
      "AI personalization per prospect based on LinkedIn/website",
      "Multi-step sequences with smart reply detection",
    ],
    beforeAfter: [
      { before: "SDR sends 30 cold emails/day manually, 1% reply.", after: "1,000 emails/day, 4-6% reply through personalization + warm-up." },
      { before: "Inbox flagged as spam after 200 emails/day.", after: "100% inbox placement through domain and mailbox strategy." },
    ],
    steps: [
      { title: "Buy 5 secondary domains", detail: "Protect main domain. E.g. tryyourcompany.com, getyourcompany.com." },
      { title: "Create 15-25 mailboxes + warm-up", detail: "2-3 weeks auto warm-up before starting your first campaign." },
      { title: "Define ICP + 500 prospects", detail: "Job titles, industries, company size — very precise." },
      { title: "Write 4-step campaign", detail: "Open, value, case-study, break-up. Keep it short." },
      { title: "A/B test subject lines", detail: "First week: run 3 variants, scale the best." },
    ],
    bestFor: "B2B sales teams that want to scale outbound beyond 100 emails/day.",
    notFor: "Heavily regulated sectors or consumer markets.",
  },
  hubspot: {
    tagline: "AI agents in CRM, marketing and sales — all in one system.",
    useCases: [
      "Automatic lead scoring on behavior + company data",
      "AI-personalized email flows per segment",
      "Content assistant for blogs, landing pages, social",
      "Forecasting based on pipeline history",
    ],
    beforeAfter: [
      { before: "Sales approached leads without priority — 8% conversion.", after: "Top-scoring leads first — 18% conversion." },
      { before: "Marketing writes 1 blog/week.", after: "3 blogs/week + 5 social variations per blog." },
    ],
    steps: [
      { title: "Import existing CRM data", detail: "Clean up duplicate records first — start clean." },
      { title: "Activate lead scoring", detail: "Start with simple rules: site visit, email open, demo request." },
      { title: "1 email flow per segment", detail: "Welcome + nurture + win-back. Test 4 weeks." },
      { title: "Connect content assistant to brand voice", detail: "Upload 5 best blogs as reference." },
    ],
    bestFor: "Companies with 1,000+ contacts and a structured sales process.",
  },
  github: {
    tagline: "AI assistant for your entire engineering team.",
    useCases: [
      "Remove boilerplate code — focus on logic",
      "Automatically suggest code reviews",
      "Generate tests for existing code",
      "Refactor to modern patterns",
    ],
    beforeAfter: [
      { before: "Story throughput of 8 points/sprint per dev.", after: "12-14 points/sprint after 4 weeks of adoption." },
      { before: "Test coverage 40%, nobody writes tests.", after: "Coverage 70% — Copilot suggests tests on every PR." },
    ],
    steps: [
      { title: "Activate GitHub Copilot Business", detail: "Org policy: block code from public repos in suggestions." },
      { title: "Choose 1 squad as pilot", detail: "Measure baseline story throughput 2 weeks ahead." },
      { title: "Share best practices", detail: "Weekly 'prompt tips' share moment in standup." },
      { title: "Roll out to entire engineering", detail: "After 4-week pilot — collect ROI figures." },
    ],
    bestFor: "Engineering teams of 5+ developers.",
  },
  // Default template for tools without their own detail
};

export const TOOL_DB: Record<string, ToolRec> = {
  // Generative & research
  openai: { name: "ChatGPT (OpenAI)", category: "Generative AI", description: "Conversational AI for writing, analysis and reasoning.", useCase: "Write proposals, summarize meetings, build internal copilots.", url: "https://openai.com", domain: "openai.com", pricing: "€ 20 / user / mo", setupTime: "1 day", firstStep: "Activate ChatGPT Team workspace and choose 3 use cases with the team." },
  claude: { name: "Anthropic Claude", category: "Generative AI", description: "Model with long context and strong document analysis.", useCase: "Analyze contracts, policies and large knowledge bases.", url: "https://anthropic.com", domain: "anthropic.com", pricing: "€ 20 / user / mo", setupTime: "1 day", firstStep: "Create Claude Projects for the 3 largest document streams." },
  perplexity: { name: "Perplexity", category: "Research", description: "AI research engine with source citations.", useCase: "Market research, competitive analysis, due diligence.", url: "https://perplexity.ai", domain: "perplexity.ai", pricing: "€ 20 / user / mo", setupTime: "< 1 hr", firstStep: "Set up Spaces per account manager for client research." },
  notionai: { name: "Notion AI", category: "Productivity", description: "AI in your knowledge base.", useCase: "Auto-summaries, generate tasks, internal docs.", url: "https://notion.so/product/ai", domain: "notion.so", pricing: "€ 10 / user / mo", setupTime: "1 week", firstStep: "Upgrade existing Notion to AI plan and create a meeting template." },

  // No-code automation (repetitive tasks)
  n8n: { name: "n8n", category: "No-code Automation", description: "Open-source workflow automation with 400+ integrations and native AI nodes.", useCase: "Automate repetitive tasks between your tools — invoices, leads, reports.", url: "https://n8n.io", domain: "n8n.io", pricing: "€ 0 self-hosted / from € 20 cloud", setupTime: "2 weeks", firstStep: "Map top-3 repetitive actions and build the first workflow." },
  make: { name: "Make.com", category: "No-code Automation", description: "Visual workflow builder with drag-and-drop scenarios.", useCase: "Automate multi-step processes without a developer.", url: "https://make.com", domain: "make.com", pricing: "from € 9 / mo", setupTime: "1-2 weeks", firstStep: "Try free tier on 1 real hand-off (e.g. lead → CRM)." },
  zapier: { name: "Zapier", category: "No-code Automation", description: "Market leader in app integrations, with built-in AI steps.", useCase: "Quickly connect 6,000+ apps point-to-point.", url: "https://zapier.com", domain: "zapier.com", pricing: "from € 20 / mo", setupTime: "< 1 week", firstStep: "Create Zaps for inbox → CRM and form → Slack." },

  // Email marketing & outbound
  instantly: { name: "Instantly.ai", category: "AI Email Marketing", description: "AI cold outreach platform with unlimited mailboxes and deliverability tools.", useCase: "Run hyper-personalized outbound campaigns on autopilot for more leads and revenue.", url: "https://instantly.ai", domain: "instantly.ai", pricing: "from € 37 / mo", setupTime: "2-3 weeks (warm-up)", firstStep: "Start 5 mailbox warm-ups and set up 1 ICP campaign of 500 prospects." },
  smartlead: { name: "Smartlead", category: "AI Email Marketing", description: "AI-driven cold email with automatic warm-up and personalization.", useCase: "Scalable lead generation for B2B sales teams.", url: "https://smartlead.ai", domain: "smartlead.ai", pricing: "from € 39 / mo", setupTime: "2-3 weeks", firstStep: "Domain warm-up + create spintax templates for first segment." },
  clay: { name: "Clay", category: "Lead Enrichment", description: "AI prospect research and data enrichment in one workflow.", useCase: "Enrich lead lists with personal insights before outreach.", url: "https://clay.com", domain: "clay.com", pricing: "from € 134 / mo", setupTime: "1 week", firstStep: "Define ICP and build first enrichment table with 500 leads." },
  hubspot: { name: "HubSpot Breeze", category: "Sales & Marketing", description: "AI agents in CRM, marketing and content.", useCase: "Lead scoring, email personalization, content creation.", url: "https://hubspot.com", domain: "hubspot.com", pricing: "from € 90 / mo", setupTime: "2-4 weeks", firstStep: "Import existing CRM data and activate lead scoring." },

  // Customer service & voice
  vapi: { name: "Vapi", category: "AI Voice Agent", description: "Real-time AI voice agents that answer, respond and transfer calls.", useCase: "24/7 phone answering so no customer ever goes unanswered.", url: "https://vapi.ai", domain: "vapi.ai", pricing: "± € 0.08 / min + setup", setupTime: "1-2 weeks", firstStep: "Build FAQ script and connect Vapi agent to existing phone number." },
  retell: { name: "Retell AI", category: "AI Voice Agent", description: "Low-latency AI call agent with natural voice.", useCase: "Automate inbound & outbound calls — qualification, support, appointments.", url: "https://retellai.com", domain: "retellai.com", pricing: "± € 0.07 / min", setupTime: "1-2 weeks", firstStep: "Build demo bot for appointment scheduler and test with 10 colleagues." },
  intercom: { name: "Intercom Fin", category: "Customer Service", description: "AI agent that resolves customer questions directly in chat & email.", useCase: "Autonomously handle up to 70% of support tickets, 24/7.", url: "https://intercom.com/fin", domain: "intercom.com", pricing: "± € 0.90 per resolved conversation", setupTime: "1-2 weeks", firstStep: "Import help center articles + train Fin on last 100 tickets." },
  chatbase: { name: "Chatbase", category: "Custom AI Chatbot", description: "Train a GPT chatbot on your own website & docs in minutes.", useCase: "Qualify leads and handle FAQs directly on your site or contact form.", url: "https://chatbase.co", domain: "chatbase.co", pricing: "from € 19 / mo", setupTime: "< 1 day", firstStep: "Upload website + 5 PDFs and place widget on contact page." },

  // Invoicing & finance
  klippa: { name: "Klippa SpendControl", category: "AI Finance", description: "AI receipt, invoice and spend recognition with automatic booking.", useCase: "Fully automate invoice processing and expense declarations.", url: "https://klippa.com", domain: "klippa.com", pricing: "from € 5 / user / mo", setupTime: "1-2 weeks", firstStep: "Connect accounting package and run first 100 invoices through OCR." },
  ramp: { name: "Ramp", category: "AI Finance", description: "Spend management platform with AI insights & auto-categorization.", useCase: "Automatically code and approve company expenses.", url: "https://ramp.com", domain: "ramp.com", pricing: "Free core / paid tiers", setupTime: "2 weeks", firstStep: "Roll out company cards and set accounting rules." },

  // Content & creative
  midjourney: { name: "Midjourney", category: "Image Generation", description: "State-of-the-art AI image generation.", useCase: "Create marketing visuals, mockups and brand assets.", url: "https://midjourney.com", domain: "midjourney.com", pricing: "from € 10 / mo", setupTime: "< 1 day", firstStep: "Translate brand style guide into 3 prompt templates." },
  runway: { name: "Runway", category: "AI Video", description: "AI video generation and editing.", useCase: "Produce marketing videos and product demos.", url: "https://runwayml.com", domain: "runwayml.com", pricing: "from € 15 / mo", setupTime: "1 week", firstStep: "Create first 30s product explainer and test on LinkedIn." },
  elevenlabs: { name: "ElevenLabs", category: "AI Voice", description: "Realistic AI voice synthesis & dubbing.", useCase: "Voice-overs, IVR systems, multilingual content.", url: "https://elevenlabs.io", domain: "elevenlabs.io", pricing: "from € 5 / mo", setupTime: "< 1 day", firstStep: "Clone your own voice for onboarding videos or IVR." },
  descript: { name: "Descript", category: "Content Creation", description: "Video & podcast editing on a text basis with AI.", useCase: "Produce webinars and podcasts 5× faster.", url: "https://descript.com", domain: "descript.com", pricing: "from € 15 / mo", setupTime: "1 week", firstStep: "Repurpose existing webinar and cut into 8 social clips." },

  // Development & data
  github: { name: "GitHub Copilot", category: "Development", description: "AI assistant for developers and engineering teams.", useCase: "Accelerate software development and code reviews.", url: "https://github.com/features/copilot", domain: "github.com", pricing: "€ 19 / dev / mo (Business)", setupTime: "< 1 day", firstStep: "Set org policy and roll out to 1 squad as pilot." },
  cursor: { name: "Cursor", category: "Development", description: "AI-first code editor with agent mode.", useCase: "Build entire features by letting AI work on your codebase.", url: "https://cursor.com", domain: "cursor.com", pricing: "€ 20 / dev / mo", setupTime: "< 1 day", firstStep: "Senior dev pilot, measure baseline story throughput." },
  pinecone: { name: "Pinecone", category: "Infrastructure", description: "Vector database for AI knowledge storage and retrieval.", useCase: "Build internal copilots over your own data.", url: "https://pinecone.io", domain: "pinecone.io", pricing: "from € 0 / serverless usage", setupTime: "2 weeks", firstStep: "Choose knowledge base source and index first 10K documents." },

  // Forecasting / planning
  pecan: { name: "Pecan AI", category: "Predictive AI", description: "Predictive analytics without a data scientist.", useCase: "Demand forecasting, churn prediction, lead scoring.", url: "https://pecan.ai", domain: "pecan.ai", pricing: "On request (enterprise)", setupTime: "4-6 weeks", firstStep: "Prioritize 1 use case (e.g. churn) and extract historical data." },
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
  effort: string;        // "30 minutes", "1 day"
  impact: string;        // "€ 5K / year", "More leads right away"
  howTo: string;         // 1-2 concrete sentences
};

export type WeeklyPlanItem = {
  week: string;          // "Week 1"
  focus: string;         // "Foundation & quick wins"
  actions: string[];     // 2-4 concrete actions
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
  label: string;          // human label, e.g. "FTE in company"
  value: number;          // current numeric value
  unit: "fte" | "eur" | "pct" | "count";
  confidence: "high" | "low";  // 'high' = derived from public data / explicit input, 'low' = estimated band
  source: string;         // e.g. "Estimated from team size band 11–50"
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
  /** Directly actionable quick wins for this week. */
  quickWins: QuickWin[];
  /** 90-day weekly plan with concrete actions. */
  weeklyPlan: WeeklyPlanItem[];
  /** Worst / base / best case ROI scenarios. */
  sensitivity: SensitivityScenario[];
  /** QA notes from deterministic overrides (e.g. team size adjusted by site detection). */
  qaNotes?: string[];
};

/** Re-export — concrete shape lives in site-signals.server.ts but the type
 *  is duplicated here so audit.ts stays pure (no server-only imports). */
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
      label: "Labor savings",
      amount: laborSavings,
      formula: `${Math.round(fte)} FTE × ${_fmt(fteCost)} × ${(automatableShare * 100).toFixed(0)}% automatable`,
      rationale: `Loaded annual cost per FTE × share that AI/automation can remove.`,
    },
    {
      label: "Revenue uplift",
      amount: revenueUplift,
      formula: `${_fmt(revenue)} annual revenue × ${(revenueUpliftPct * 100).toFixed(1)}% uplift`,
      rationale: `Extra revenue via better conversion, AI outbound and upsell.`,
    },
    {
      label: "Retention gain",
      amount: retentionGain,
      formula: `${Math.round(customers).toLocaleString("nl-NL")} customers × ${_fmt(customerValue)} × ${(retentionPct * 100).toFixed(2)}% (${(churnRecoveryPct * 100).toFixed(0)}% of ${(churn * 100).toFixed(1)}% churn)`,
      rationale: `Share of annual churn recoverable via 24/7 AI support and proactive outreach.`,
    },
    {
      label: "Tooling efficiency",
      amount: efficiencyGain,
      formula: `${Math.round(stackCount)} existing tools × € 2,500 integration gain`,
      rationale: `Connecting the existing stack via n8n / Make delivers small but certain gains per tool.`,
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
  "€ 500 – € 2,500": 1_500,
  "€ 2,500 – € 10K": 6_000,
  "€ 10K+": 20_000,
};

const CUSTOMERS_MID: Record<string, number> = {
  "< 50": 25,
  "50 – 250": 150,
  "250 – 1,000": 600,
  "1,000 – 10,000": 5_000,
  "10,000+": 25_000,
};

/** Enrich tool with its slug (DB key) so the UI can link to /tools/$slug. */
function withSlug(slug: string, t: ToolRec): ToolRec {
  return { ...t, slug };
}

/** Lookup helper for the detail page. */
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

  if (pains.has("Repetitive work")) picks.push("n8n", "make");
  if (pains.has("Slow customer service") || goals.has("Improve customer experience")) {
    picks.push("vapi", "intercom", "chatbase");
  }
  if (pains.has("Lead generation") || goals.has("Increase revenue")) {
    picks.push("instantly", "clay", "hubspot");
  }
  if (pains.has("Administration & invoicing")) picks.push("klippa", "ramp");
  if (pains.has("Content creation takes too much time")) picks.push("midjourney", "runway", "descript");
  if (pains.has("Data scattered across systems")) picks.push("pinecone", "n8n");
  if (pains.has("Forecasting & planning")) picks.push("pecan", "perplexity");
  if (stack.has("Notion")) picks.push("notionai");
  if (stack.has("Custom software")) picks.push("github", "cursor");
  if (goals.has("Employee productivity")) picks.push("notionai", "zapier");
  if (goals.has("Make decisions faster")) picks.push("perplexity");

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
      qaNotes.push(`Team size derived from team page (detected: ${siteSignals.estimatedTeamSize}).`);
    }
  }
  const revenue = REV_MID[a.revenue] ?? 200_000;
  let customerValue = CUSTOMER_VALUE_MID[a.customerValue] ?? 500;
  if ((!a.customerValue || a.customerValue === "Unknown") && siteSignals?.pricePoints?.length) {
    const sorted = [...siteSignals.pricePoints].sort((x, y) => x - y);
    const median = sorted[Math.floor(sorted.length / 2)];
    customerValue = Math.round(median * 12);
    qaNotes.push(`Customer value estimated from pricing page (median € ${median}/mo × 12 = € ${customerValue}/yr).`);
  }
  const customers = CUSTOMERS_MID[a.customersPerYear] ?? 100;
  const painCount = a.painPoints.length;
  const goalCount = a.goals.length;
  const stackCount = a.techStack.length;
  const pains = new Set(a.painPoints);
  const goals = new Set(a.goals);

  // ----- FOLLOW-UP FINANCIALS (override defaults where provided) -----
  const HOURLY_MID: Record<string, number> = {
    "< € 30": 25, "€ 30 – € 50": 40, "€ 50 – € 80": 65, "€ 80 – € 120": 100, "> € 120": 140,
  };
  const hourlyCost = a.avgHourlyCost ? HOURLY_MID[a.avgHourlyCost] : null;
  // Loaded yearly cost ~ 1600 productive hours × hourly rate (NL benchmark) — use hourly if available.
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
  const wantsCostCut = goals.has("Reduce operational costs");
  const wantsProductivity = goals.has("Employee productivity");
  if (wantsCostCut) automatableShare += 0.08;
  if (wantsProductivity) automatableShare += 0.05;
  if (!wantsCostCut && !wantsProductivity) automatableShare *= 0.55;
  automatableShare = Math.min(Math.max(automatableShare, 0.03), 0.40);

  // ----- REVENUE UPLIFT pct (goal-weighted) -----
  let revenueUpliftPct = Math.min(0.01 * goalCount, 0.04);
  const wantsRevenue = goals.has("Increase revenue");
  const wantsLeads = pains.has("Lead generation");
  if (wantsRevenue) revenueUpliftPct += 0.05;
  if (wantsLeads) revenueUpliftPct += 0.025;
  if (!wantsRevenue && !wantsLeads) revenueUpliftPct *= 0.4;
  // OVERRIDE: site-detected sales hiring → bump uplift starting point.
  if (siteSignals?.hasOpenRoles && siteSignals.openRoleCategories.includes("sales")) {
    revenueUpliftPct += 0.015;
    qaNotes.push("Sales vacancy/vacancies found on website → +1.5pp revenue uplift starting hypothesis.");
  }
  revenueUpliftPct = Math.min(Math.max(revenueUpliftPct, 0.005), 0.10);

  // ----- RETENTION recovery pct -----
  let churnRecoveryPct = 0.15;
  if (goals.has("Improve customer experience")) churnRecoveryPct += 0.10;
  if (pains.has("Slow customer service")) churnRecoveryPct += 0.08;
  if (!goals.has("Improve customer experience") && !pains.has("Slow customer service")) churnRecoveryPct = 0.10;

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
    if (ds.includes("Own database / tool")) r += 18;
    if (ds.includes("Excel / Google Sheets")) r += 8;
    if (ds.includes("Email inbox is our CRM")) r -= 5;
    if (ds.includes("No idea / no system")) r -= 10;
    if (typeof a.processMaturity === "number") r += Math.round((a.processMaturity / 100) * 30);
    if (a.website) r += 5;
    readinessScore = Math.min(Math.max(r, 15), 95);
    readinessDrivers = [
      ds.length ? `Customer data systems: ${ds.slice(0, 2).join(", ")}${ds.length > 2 ? "…" : ""}` : "No customer data systems specified",
      typeof a.processMaturity === "number"
        ? `Process documentation: ${a.processMaturity}/100 (${a.processMaturity < 30 ? "weak" : a.processMaturity < 70 ? "average" : "strong"})`
        : "Process maturity not specified",
      a.website ? `+5 pts for public website` : `No website specified`,
    ];
  } else {
    const readinessRaw = 30 + stackCount * 6 + (a.size ? 8 : 0) + (a.website ? 6 : 0) + (a.budget && a.budget !== "Not yet known" ? 8 : 0);
    readinessScore = Math.min(Math.max(readinessRaw, 20), 95);
    readinessDrivers = [
      `+${stackCount * 6} pts for ${stackCount} existing tools in the stack`,
      a.website ? `+6 pts for public website (analyzed)` : `+0 pts — no website specified`,
      a.budget && a.budget !== "Not yet known" ? `+8 pts for concrete budget (${a.budget})` : `+0 pts — budget not yet known`,
    ];
  }

  // OVERRIDE: mature data tooling detected on website → +10 readiness.
  if (siteSignals?.detectedTech?.some((t) => ["Shopify", "HubSpot", "Salesforce"].includes(t))) {
    const before = readinessScore;
    readinessScore = Math.min(readinessScore + 10, 98);
    qaNotes.push(`Mature data stack detected (${siteSignals.detectedTech.filter((t) => ["Shopify","HubSpot","Salesforce"].includes(t)).join(", ")}) → readiness +10 (${before} → ${readinessScore}).`);
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
      a.biggestTimeWaster ? `Concrete time waster identified → direct automation opportunity` : `No specific time waster specified`,
      a.decisionPain ? `Decision pain: "${a.decisionPain}"` : `No recurring decision pain specified`,
      `+${painCount * 4} pts for ${painCount} pain points`,
    ];
  } else {
    const automationRaw = 35 + painCount * 7 + (pains.has("Repetitive work") ? 10 : 0) + (stackCount >= 3 ? 5 : 0);
    automationScore = Math.min(automationRaw, 95);
    automationDrivers = [
      `+${painCount * 7} pts for ${painCount} identified pain points`,
      pains.has("Repetitive work") ? `+10 pts — repetitive work is top of mind` : `No explicit repetitive burden specified`,
      stackCount >= 3 ? `+5 pts — enough systems to connect between` : `Limited stack to connect to`,
    ];
  }

  // IMPACT
  const impactRaw = 35 + goalCount * 7 + Math.min(Math.log10(Math.max(revenue, 10_000)) * 4, 20);
  let impactScore = Math.min(Math.round(impactRaw), 98);
  let impactBudgetNote = "";
  if (a.maxToolBudget) {
    if (a.maxToolBudget === "€ 2,000+") { impactScore = Math.min(impactScore + 6, 98); impactBudgetNote = ` Budget willingness > € 2,000/mo increases achievable impact.`; }
    else if (a.maxToolBudget === "< € 100") { impactScore = Math.max(impactScore - 8, 25); impactBudgetNote = ` Budget < € 100/mo limits tool choice to a lightweight stack.`; }
  }

  const scoreDetails = {
    readiness: {
      value: readinessScore,
      rationale: hasQuiz
        ? `Based on your customer data systems and how well processes are documented.`
        : `Based on current stack (${stackCount} tools), team size (${a.size || "?"}), website presence and budget clarity.`,
      drivers: readinessDrivers,
    },
    automation: {
      value: automationScore,
      rationale: hasQuiz
        ? `Calculated from your own identified time waster and decision pain — strongest signal for automation potential.`
        : `Calculated from the number of pain points (${painCount}) and whether repetitive work was explicitly mentioned.`,
      drivers: automationDrivers,
    },
    impact: {
      value: impactScore,
      rationale: `Weighted from number of goals (${goalCount}) and company scale by revenue (${a.revenue || "?"}).${impactBudgetNote}`,
      drivers: [
        `+${goalCount * 7} pts for ${goalCount} concrete goals`,
        `+${Math.round(Math.min(Math.log10(Math.max(revenue, 10_000)) * 4, 20))} pts based on revenue scale`,
        wantsRevenue ? `Goal "Increase revenue" — high ROI lever on revenue side` : `Focus is on internal efficiency`,
      ],
    },
  };

  // ----- VALUE LINE ITEMS — start from pure model, then enrich rationale with audit context -----
  const valueLineItems: ValueLineItem[] = valueModel.valueLineItems.map((it) => {
    if (it.label === "Labor savings") {
      return { ...it, rationale: wantsCostCut || wantsProductivity
        ? `Goal "${wantsCostCut ? "reduce costs" : "productivity"}" increases the automatable share.`
        : `Goals are not primarily focused on cost-cutting — share deliberately moderated.` };
    }
    if (it.label === "Revenue uplift") {
      return { ...it, rationale: wantsRevenue
        ? `Goal "Increase revenue" adds +5 pp uplift via better lead conversion and outbound (Instantly.ai / Clay).`
        : wantsLeads
          ? `Pain point "Lead generation" adds +2.5 pp uplift via AI outbound.`
          : `No revenue goal specified — conservative estimate.` };
    }
    if (it.label === "Retention gain") {
      return { ...it, rationale: a.churnRate
        ? `Churn input "${a.churnRate}" + ${(churnRecoveryPct * 100).toFixed(0)}% recoverable via AI voice/chat (Vapi, Intercom Fin).`
        : `No churn input provided — industry default of 10% annual churn used.` };
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
    { id: "fte", label: "FTE in company", value: fte, unit: "fte", confidence: sizeKnown ? "high" : "low",
      source: sizeKnown ? `Derived from team size band ${a.size}` : "Estimated — enter your own number for a more precise result",
      min: 1, max: 5000, step: 1 },
    { id: "fteCost", label: "Loaded annual cost / FTE", value: FTE_COST, unit: "eur", confidence: hourlyKnown ? "high" : "low",
      source: hourlyKnown ? `Hourly rate "${a.avgHourlyCost}" × 1,600 productive hours` : "NL benchmark € 55K — adjust for your own hourly rate",
      min: 20_000, max: 200_000, step: 1_000 },
    { id: "automatableShare", label: "Automatable share of work", value: automatableShare, unit: "pct", confidence: "low",
      source: `Derived from ${painCount} pain points + goals — typical range 5–35%`,
      min: 0.02, max: 0.50, step: 0.01 },
    { id: "revenue", label: "Annual revenue", value: revenue, unit: "eur", confidence: revenueKnown ? "high" : "low",
      source: revenueKnown ? `Median of band ${a.revenue}` : "Industry default — enter your own revenue",
      min: 50_000, max: 100_000_000, step: 10_000 },
    { id: "revenueUpliftPct", label: "Expected revenue uplift", value: revenueUpliftPct, unit: "pct", confidence: "low",
      source: `Based on ${goalCount} goals + lead pain points — typically 1–8%`,
      min: 0.005, max: 0.15, step: 0.005 },
    { id: "customers", label: "Customers per year", value: customers, unit: "count", confidence: customersKnown ? "high" : "low",
      source: customersKnown ? `Median of band ${a.customersPerYear}` : "Estimated — adjust for more precise retention calculation",
      min: 1, max: 1_000_000, step: 1 },
    { id: "customerValue", label: "Average customer value / year", value: customerValue, unit: "eur", confidence: cvKnown ? "high" : "low",
      source: cvKnown ? `Median of band ${a.customerValue}` : "Estimated — often easy to determine from bookkeeping",
      min: 10, max: 1_000_000, step: 10 },
    { id: "churn", label: "Annual churn", value: churn, unit: "pct", confidence: churnKnown ? "high" : "low",
      source: churnKnown ? `Median of band ${a.churnRate}` : "Industry default 10% — adjust in 30 seconds",
      min: 0.005, max: 0.80, step: 0.005 },
    { id: "churnRecoveryPct", label: "Share of churn recoverable by AI", value: churnRecoveryPct, unit: "pct", confidence: "low",
      source: "Estimate based on CX focus in goals — typically 10–35%",
      min: 0.05, max: 0.50, step: 0.01 },
    { id: "stackCount", label: "Existing tools in stack", value: stackCount, unit: "count", confidence: stackKnown ? "high" : "low",
      source: stackKnown ? `${stackCount} tools listed in audit` : "No tools specified — every integration gain counts",
      min: 0, max: 50, step: 1 },
  ];

  const company = a.companyName || "your organization";
  const roadmap = [
    { phase: "Phase 1 · 0–30 days", title: "Foundation & Quick Wins", description: `Roll out a secure ChatGPT/Claude workspace for ${company} and train the team on prompt fundamentals. Identify 3 repetitive tasks to automate first.` },
    { phase: "Phase 2 · 1–3 months", title: "Workflow Automation", description: `Connect existing tools (${a.techStack.slice(0, 3).join(", ") || "core stack"}) with no-code AI automations via n8n or Make. Pilot an AI assistant targeting the biggest pain: ${a.painPoints[0] || "operational friction"}.` },
    { phase: "Phase 3 · 3–6 months", title: "Custom AI Capability", description: `Build a knowledge-grounded copilot over ${company}'s own data with vector search. Define KPIs and scale to other departments.` },
    { phase: "Phase 4 · 6–12 months", title: "AI as Competitive Advantage", description: `Embed AI in ${company}'s product, measure ROI and establish a small AI Center of Excellence for continuous innovation.` },
  ];

  const radar: RadarPoint[] = [
    { axis: "Data maturity", value: Math.min(40 + stackCount * 6, 95), benchmark: 55 },
    { axis: "Automation", value: automationScore, benchmark: 50 },
    { axis: "Customer experience", value: Math.min(45 + (pains.has("Slow customer service") ? 25 : 10) + goalCount * 4, 95), benchmark: 60 },
    { axis: "Revenue ops", value: Math.min(35 + (pains.has("Lead generation") ? 30 : 10) + goalCount * 5, 95), benchmark: 50 },
    { axis: "Talent & skills", value: Math.min(30 + stackCount * 5, 90), benchmark: 55 },
    { axis: "AI readiness", value: readinessScore, benchmark: 60 },
  ];

  const summary = `Based on the completed profile, ${company} can realistically unlock € ${estimatedAnnualValue.toLocaleString("nl-NL")} in annual value — spread across labor savings, revenue uplift and higher retention. The report below shows exactly how.`;

  const topPain = a.painPoints[0] || "operational friction";
  const topGoal = a.goals[0] || "growth";

  const timeWasterQuote = a.biggestTimeWaster?.trim();
  const quickWins: QuickWin[] = [
    timeWasterQuote
      ? {
          title: `Address your #1 time waster`,
          effort: "1-2 days",
          impact: `± ${fmt(fte * 400)} / year time savings`,
          howTo: `You mentioned: "${timeWasterQuote}". Build a Make.com or n8n flow for this in week 1 — often working in 2 days, and delivering time savings from day 3 onwards.`,
        }
      : { title: `Roll out ChatGPT Team for ${company}`, effort: "1 day", impact: `± ${fmt(fte * 200)} / year time savings`, howTo: "Activate ChatGPT Team, invite the core team and create 3 prompt templates for the most common tasks." },
    { title: `Automate 1 repetitive workflow in Make.com`, effort: "half a day", impact: `${fmt(8000)} / year`, howTo: `Take "${topPain}" and build 1 scenario that removes the hand-off between 2 tools.` },
    a.decisionPain
      ? { title: `Decision copilot for "${a.decisionPain}"`, effort: "1 week", impact: "Faster & more consistent decisions", howTo: `Build a GPT with your historical data so the team gets a reasoned proposal for "${a.decisionPain.toLowerCase()}" in seconds.` }
      : { title: `AI chatbot on contact page (Chatbase)`, effort: "2 hours", impact: "10–30% more qualified leads", howTo: "Upload your website + FAQ and place the widget. Immediately more conversion without devs." },
  ];

  // OVERRIDE: low/no content velocity + revenue goal → content-engine quick win.
  if (
    siteSignals &&
    (siteSignals.contentVelocity === "none" || siteSignals.contentVelocity === "low") &&
    goals.has("Increase revenue")
  ) {
    quickWins.push({
      title: `Content engine with AI for ${company}`,
      effort: "1 week",
      impact: "3-5× publication frequency without extra hires",
      howTo: `We noticed little recent content on your site. Set up a ChatGPT/Claude flow that produces 3 blog drafts + 5 social variations per week in your tone of voice.`,
    });
    qaNotes.push(`Content velocity detected: ${siteSignals.contentVelocity} → quick win 'Content engine' added.`);
  }

  const weeklyPlan: WeeklyPlanItem[] = [
    { week: "Week 1", focus: "Foundation", actions: [`AI policy + Team workspace for ${company}`, "Audit of top-5 repetitive tasks", "Choose 1 quick win from the list above"] },
    { week: "Week 2-3", focus: "First automation", actions: [`Build n8n/Make workflow for "${topPain}"`, "Measure baseline time savings", "Train team on usage"] },
    { week: "Week 4-6", focus: "Customer-facing AI", actions: [pains.has("Slow customer service") ? "Vapi pilot for inbound calls" : "Chatbase on website", "Measure response time & conversion", "Iterate on prompts"] },
    { week: "Week 7-9", focus: `Scale on "${topGoal}"`, actions: [wantsRevenue ? "Instantly.ai outbound campaign live" : "Roll out second workflow", "Set up KPI dashboard", "Team adoption check"] },
    { week: "Week 10-13", focus: "Anchor & expand", actions: ["Measure results vs baseline", "Finalize roadmap for Q2", "Budget request for scale"] },
  ];

  const sensitivity: SensitivityScenario[] = [
    { label: "Worst case", multiplier: 0.5, estimatedValue: Math.round(estimatedAnnualValue * 0.5 / 1000) * 1000, rationale: "Slow adoption, only 50% of potential realized in year 1." },
    { label: "Base case", multiplier: 1.0, estimatedValue: estimatedAnnualValue, rationale: "Expected outcome with average adoption and execution per roadmap." },
    { label: "Best case", multiplier: 1.6, estimatedValue: Math.round(estimatedAnnualValue * 1.6 / 1000) * 1000, rationale: "Fast adoption + expansion to adjacent processes, margin effect via gross margin of " + (grossMargin * 100).toFixed(0) + "%." },
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
