// Lightweight, fully client-side intent matcher for "Kirky".
// No API calls, no PII collection. Runs entirely in the browser on a static
// export. Knowledge base mirrors Costco's published facts (CEO, members, fees,
// countries, climate goals) and India GCC specifics (Hyderabad, Rajeev Mall,
// scope, hiring partner). Matching uses keyword + phrase + regex signals,
// with light stemming and edit-distance fuzzy matching for typos, plus a
// recency penalty so the bot doesn't repeat its last reply on follow-ups.

export type Intent = {
  id: string;
  /** Required tokens (any of). Match if input contains ≥1. */
  any?: string[];
  /** Optional regex patterns (any match counts as a strong signal). */
  patterns?: RegExp[];
  /** Phrase boosts — adds extra score if the bigram is present. */
  phrases?: string[];
  reply: string;
  followups?: string[];
};

const careersUrl = 'https://talent500.com/jobs/costco/';

export const intents: Intent[] = [
  // ----------------------------- Greet / persona -----------------------------
  {
    id: 'greet',
    any: ['hi', 'hello', 'hey', 'namaste', 'howdy', 'yo', 'hola', 'sup'],
    patterns: [/good (morning|afternoon|evening|day)/i, /^h(i|ello|ey)\b/i],
    reply:
      "Hi, I'm Kirky — your Costco India GCC guide. I can help with Costco facts, our Hyderabad office, capabilities, careers, life at Costco, ESG, ethics, and contact info.",
    followups: ['Tell me about Costco', 'What does the GCC do?', 'Where are you located?', 'How do I apply for jobs?'],
  },
  {
    id: 'who-is-kirky',
    any: ['kirky', 'persona', 'assistant', 'chatbot'],
    patterns: [/who (are|is) you/i, /your name/i, /why kirky/i, /name.*bot/i, /are you (a )?(human|real|ai|bot|robot)/i],
    phrases: ['who are you', 'what is your name'],
    reply:
      "I'm Kirky — named after Kirkland, Washington, where Costco was once headquartered and which lent its name to the Kirkland Signature brand (launched 1995). I'm an on-page assistant that runs entirely in your browser — no AI server, no data collection.",
    followups: ['What is Kirkland Signature?', 'Tell me about Costco', 'What can you help with?'],
  },
  {
    id: 'capabilities-bot',
    patterns: [/what can you (do|help|answer)/i, /how can you help/i, /menu|options/i, /what.*topics/i, /^help$/i, /what.*ask/i],
    reply:
      "I can answer: Costco facts (CEO, members, revenue, countries, Kirkland Signature), India GCC (Hyderabad office, leadership, capabilities), careers and the interview process, life at Costco, ESG, ethics & whistleblower, privacy & cookies, and contact info.",
    followups: ['Tell me about the GCC', 'Who is the CEO?', 'How many members does Costco have?', 'How do I apply?'],
  },
  {
    id: 'human-handover',
    any: ['agent', 'human', 'recruiter', 'representative', 'rep', 'support'],
    patterns: [/talk to (a )?(human|person|agent|recruiter)/i, /real person/i],
    reply:
      "I can't connect you to a human directly, but the Contact section on this page goes straight to the team. For careers, the Talent500 portal is the fastest route — recruiters reach out from there.",
    followups: ['How do I get in touch?', 'How do I apply for jobs?'],
  },

  // ----------------------------- Costco corporate -----------------------------
  {
    id: 'costco-corp',
    any: ['costco', 'company', 'history', 'story'],
    phrases: ['about costco', 'costco history', 'tell me about costco'],
    reply:
      "Costco Wholesale Corporation is a membership warehouse club founded on September 15, 1983 by James Sinegal and Jeffrey Brotman. It's headquartered in Issaquah, Washington, and operates 924+ warehouses across 11 countries (as of March 2026). FY2024 revenue was about $254 billion.",
    followups: ['Who is the CEO?', 'What is Kirkland Signature?', "What is Costco's mission?", 'Tell me about the GCC'],
  },
  {
    id: 'ceo',
    any: ['ceo', 'president', 'leader', 'vachris', 'chief'],
    phrases: ['who is the ceo', 'who runs costco', 'who leads costco'],
    reply:
      "Ron Vachris is President & CEO of Costco Wholesale, since January 2024. He's only the third CEO in Costco's history — joining the company in 1982 as a forklift driver at a Price Club in Arizona before rising to the top.",
    followups: ['Who leads the India GCC?', 'Tell me about Costco', "What is Costco's mission?"],
  },
  {
    id: 'india-leader',
    any: ['rajeev', 'mall', 'india-ceo', 'gcc-ceo'],
    patterns: [/india (gcc )?(ceo|leader|head|md)/i, /who (runs|leads|heads).*india/i],
    phrases: ['india ceo', 'india gcc ceo'],
    reply:
      "Rajeev Mall leads the Costco India GCC as its CEO. He joined from Mondelēz International, where he was VP, Global Business Services; before that, Group CIO at Coca-Cola Bottlers Japan and President of Coca-Cola Bottlers Japan Business Services.",
    followups: ['Where is the India GCC located?', 'How big is the India GCC?'],
  },
  {
    id: 'mission',
    any: ['mission', 'purpose', 'vision', 'promise'],
    phrases: ['mission statement'],
    reply:
      "Costco's mission is to continually provide members with quality goods and services at the lowest possible prices. Everything else — operating model, sourcing, employee practices — flows from that promise.",
    followups: ['What is the Code of Ethics?', 'Tell me about membership'],
  },
  {
    id: 'code-of-ethics',
    any: ['ethic', 'ethics', 'ethical', 'code', 'principle', 'principles', 'values', 'integrity'],
    phrases: ['code of ethics'],
    reply:
      "Costco's Code of Ethics has four principles: 1) Obey the law, 2) Take care of our members, 3) Take care of our employees, 4) Respect our suppliers. Live these and the fifth follows: reward shareholders. The India GCC operates under exactly the same code.",
    followups: ["What is Costco's mission?", 'How do I report an ethics concern?'],
  },
  {
    id: 'kirkland-signature',
    any: ['kirkland', 'signature', 'kirkland-signature'],
    phrases: ['kirkland signature', 'private label', 'house brand', 'store brand'],
    reply:
      "Kirkland Signature is Costco's private label, launched in 1995 and named after Costco's former Kirkland, Washington headquarters. It accounts for roughly a third of company sales and is held to a higher standard than the national brands it competes with.",
    followups: ['Why are you called Kirky?', 'Tell me about Costco'],
  },
  {
    id: 'founders-hq',
    any: ['founder', 'founders', 'founded', 'started', 'sinegal', 'brotman', 'issaquah'],
    phrases: ['who founded', 'when founded', 'where headquartered', 'price club'],
    reply:
      "Costco was founded September 15, 1983 by James (Jim) Sinegal and Jeffrey Brotman, and is headquartered in Issaquah, Washington, USA. The Costco lineage traces to Sol Price's Price Club (1976); Costco and Price Club merged in 1993 to form PriceCostco.",
    followups: ['Who is the CEO?', 'Tell me about Costco', 'What does the GCC do?'],
  },
  {
    id: 'membership',
    any: ['membership', 'member', 'fee', 'card', 'gold', 'star', 'executive'],
    phrases: ['gold star', 'executive member', 'how does costco work', 'business model'],
    reply:
      "Costco runs a membership warehouse-club model. Two paid tiers: Gold Star ($65/year) and Executive ($130/year) — Executive members earn 2% rewards up to $1,250 on qualified purchases. As of February 2026 there are about 81.4M paid memberships and roughly 145.9M cardholders worldwide.",
    followups: ['What is Kirkland Signature?', 'How many warehouses does Costco have?'],
  },
  {
    id: 'warehouses-countries',
    any: ['warehouse', 'warehouses', 'store', 'stores', 'country', 'countries', 'global', 'worldwide'],
    phrases: ['how many warehouses', 'how many countries', 'how many stores', 'where does costco operate'],
    reply:
      "Costco operates 924+ warehouses across 11 countries as of March 2026 — about 85% in North America. Markets include the United States, Canada, Mexico, the United Kingdom, Japan, Korea, Australia, Spain, France, Iceland, China, and Taiwan.",
    followups: ['Are there Costco stores in India?', 'Where is the India GCC located?'],
  },
  {
    id: 'is-this-a-store',
    any: ['shop', 'shopping', 'buy', 'purchase', 'groceries', 'cart'],
    patterns: [
      /(costco|store|warehouse).*india/i,
      /india.*(store|warehouse|shop|location)/i,
      /can i (shop|buy)/i,
      /is this a (costco )?(store|warehouse|shop)/i,
      /(this|website|site|page).*costco (store|warehouse)/i,
      /costco.*(open|opening|launch|launching).*india/i,
      /(shop|buy|order).*at costco/i,
    ],
    phrases: ['costco in india', 'costco store india', 'shop online', 'costco india store', 'costco store', 'shop at costco', 'buy at costco'],
    reply:
      "Heads-up: this site is Costco's India GCC (Global Capability Center) — a back-office that powers Costco worldwide, not a Costco warehouse. Costco doesn't currently operate retail warehouses in India, so you can't shop here. For shopping in markets where Costco does operate, see costco.com.",
    followups: ['What does the GCC do?', 'Where is the India GCC located?'],
  },
  {
    id: 'revenue',
    any: ['revenue', 'sales', 'turnover', 'earnings', 'financials', 'fiscal', 'profit'],
    phrases: ['fy2024 revenue', 'how much money does costco make', 'annual revenue'],
    reply:
      "Costco reported approximately $254 billion in revenue for fiscal year 2024 — up about 5% year over year. Most of that is grocery and consumer goods, with a long-running mission of low markups and quality.",
    followups: ['How many warehouses does Costco have?', 'Tell me about membership'],
  },
  {
    id: 'stock-ticker',
    any: ['stock', 'ticker', 'shares', 'nasdaq', 'cost'],
    patterns: [/share price/i, /stock symbol/i],
    phrases: ['stock ticker', 'investor relations'],
    reply:
      "Costco Wholesale trades on NASDAQ under the ticker COST. Costco has paid a regular quarterly dividend for years and has occasionally issued special dividends. For current data and filings, see Costco's Investor Relations site.",
    followups: ['What is the FY2024 revenue?', 'Tell me about Costco'],
  },
  {
    id: 'hot-dog',
    any: ['hotdog', 'hot-dog', 'food-court'],
    patterns: [/\bhot dog\b/i, /\$1\.50/i, /food court/i, /rotisserie/i, /\$4\.99/i],
    reply:
      "Two Costco classics: the $1.50 hot-dog-and-soda combo (unchanged in price since 1985 — Jim Sinegal famously refused to raise it) and the $4.99 rotisserie chicken. They're not the GCC's day job, but they're a nice reminder of the value-first culture we operate from.",
    followups: ['What is the Code of Ethics?', "What is Costco's mission?"],
  },
  {
    id: 'return-policy',
    any: ['return', 'returns', 'refund', 'guarantee'],
    phrases: ['return policy', 'money back', 'satisfaction guarantee'],
    reply:
      "Costco is famous for its risk-free 100% satisfaction guarantee — most items can be returned for a full refund any time, and memberships are refundable too. Electronics have a 90-day window. Specifics live on costco.com — the GCC builds the systems behind it, not the policy itself.",
  },
  {
    id: 'gas-pharmacy-optical',
    any: ['gas', 'fuel', 'petrol', 'pharmacy', 'optical', 'hearing', 'tires', 'tyre', 'pharmacy', 'optometrist'],
    phrases: ['gas station', 'tire center', 'optical center', 'hearing aid'],
    reply:
      "Costco warehouses host a range of ancillary businesses — Gas Stations, Pharmacy, Optical, Hearing Aids, Tires, Travel, and Costco Next. None of these operate in India today; the India GCC supports the technology and operations behind them globally.",
  },
  {
    id: 'tenure-wages',
    any: ['wages', 'wage', 'tenure', 'attrition', 'turnover', 'employees'],
    patterns: [/why.*low turnover/i, /employee retention/i],
    phrases: ['employee tenure', 'pay employees'],
    reply:
      "Costco is well known for paying above-market wages and for unusually high employee retention — turnover among long-tenured staff is famously low. The same 'take care of our employees' principle anchors how the India GCC operates.",
  },

  // ----------------------------- About the India GCC -----------------------------
  {
    id: 'about-gcc',
    any: ['gcc', 'capability'],
    patterns: [/global capability cent(re|er)/i, /what.*gcc.*do/i, /india gcc/i],
    phrases: ['what does the gcc do', 'about the gcc', 'costco india', 'india operations'],
    reply:
      "Costco Wholesale India Private Limited is Costco's Global Capability Center — based at Capitaland, Madhapur, Hyderabad. We unite People, Technology, and Process to power Costco worldwide: predictive inventory, membership analytics, omnichannel fulfilment, and cybersecurity, plus engineering, data, AI, and finance ops.",
    followups: ['What capabilities do you have?', 'Where are you located?', 'Tell me about life at Costco'],
  },
  {
    id: 'why-india',
    patterns: [/why india/i, /why hyderabad/i, /why a gcc/i, /why costco.*india/i],
    reply:
      "India is the world's largest GCC ecosystem. Hyderabad pairs deep engineering and operations talent with strong policy support and 24×7 coverage — a fit for Costco's quality-at-scale operating style.",
    followups: ['Where exactly is the office?', 'What capabilities do you have?'],
  },
  {
    id: 'india-headcount',
    any: ['headcount', 'workforce', 'team-size', 'thousand'],
    patterns: [/how (many|big)/i, /size of (the )?(gcc|team)/i, /\b1[,.]?000\b/],
    phrases: ['how many employees', 'how big is the gcc', 'team size'],
    reply:
      "The India GCC plans to scale to ~1,000 employees in Hyderabad, hiring across engineering, data, AI, cloud, security, ops, and finance. The list of live roles is in the Careers section.",
  },

  // ----------------------------- Capabilities -----------------------------
  {
    id: 'capabilities',
    any: ['capabilities', 'services', 'domains', 'functions', 'offerings', 'pillars'],
    patterns: [/what.*do you (do|build)/i, /what.*you build/i],
    reply:
      "Three pillars: People (membership analytics, member services, trust & risk), Technology (cloud + SRE on GCP/BigQuery/GKE, data + lakehouse, AI/ML & GenAI), and Process (predictive inventory & merchandising, omnichannel fulfilment, finance & accounting tech).",
    followups: ['Tell me about engineering', 'Tell me about AI/ML work', 'Tell me about data work'],
  },
  {
    id: 'tech-stack',
    any: ['stack', 'technologies', 'languages', 'frameworks', 'tooling'],
    patterns: [/tech stack/i, /what (tech|technology|tools|languages)/i, /which (tech|stack|languages)/i],
    reply:
      "Headline stack: Java/Spring & C#/.NET on the backend, React/TypeScript on the front end, GCP (BigQuery, Pub/Sub, Dataflow, GKE) for data and platform, Python for data/ML, Kubernetes + Terraform + GitHub Actions for delivery, Prometheus/Grafana/OpenTelemetry for observability, and Adobe Experience Platform for MarTech. Specific stacks vary by team.",
    followups: ['Tell me about engineering', 'Tell me about data work', 'How do I apply?'],
  },
  {
    id: 'engineering',
    any: ['engineering', 'engineer', 'software', 'developer', 'sre', 'platform', 'cloud', 'devops', '.net', 'c#', 'java', 'spring', 'react', 'frontend', 'backend', 'kubernetes', 'gke', 'docker', 'terraform', 'jenkins', 'github'],
    phrases: ['spring boot', 'github actions'],
    reply:
      "Engineering at the India GCC spans cloud platforms and SRE, distributed systems (Java/Spring, C#/.NET Core), modern web (React/front-end), observability, and developer experience. Live roles often touch GitHub Actions, Jenkins, Docker, Terraform, GCP/GKE.",
    followups: ['Tell me about data work', 'Tell me about AI/ML work', 'How do I apply?'],
  },
  {
    id: 'data',
    any: ['data', 'lakehouse', 'analytics', 'pipelines', 'spark', 'kafka', 'bigquery', 'snowflake', 'etl', 'elt', 'pubsub', 'dataflow', 'sql', 'warehouse-data'],
    patterns: [/data (engineer|scientist|analyst)/i],
    reply:
      "Data engineering powers personalization, inventory, finance, and operations. Patterns include streaming and batch pipelines on GCP / BigQuery / Pub/Sub / Dataflow, contract-driven data products, ELT/ETL with Java and Python, and a strong focus on data quality.",
    followups: ['Tell me about AI/ML work', 'How do I apply?'],
  },
  {
    id: 'ai-ml',
    any: ['ai', 'ml', 'artificial', 'intelligence', 'machine', 'learning', 'genai', 'llm', 'nlp', 'vision', 'model', 'martech', 'adtech'],
    phrases: ['gen ai', 'machine learning', 'large language model', 'adobe experience'],
    reply:
      "AI/ML at the India GCC focuses on member experience, operations, and forecasting — applied responsibly. We work on classical ML and Generative AI with strong evaluations, guardrails, and human-in-the-loop where it matters most. MarTech / AdTech (incl. Adobe Experience Platform) is an active area.",
    followups: ['Tell me about data work', 'Tell me about security work', 'How do I apply?'],
  },
  {
    id: 'security',
    any: ['security', 'cyber', 'infosec', 'appsec', 'trust', 'risk', 'fraud', 'compliance', 'grc', 'iso27001', 'iso'],
    patterns: [/threat (intel|model|hunt)/i, /incident response/i],
    reply:
      "Cybersecurity, trust, and risk teams keep members safe and the business resilient — covering identity, application security, fraud, threat intel, GRC, and incident response. We align with ISO 27001 principles and Costco's global security standards.",
    followups: ['Tell me about engineering', 'How do I apply?'],
  },
  {
    id: 'qa-test',
    any: ['qa', 'quality', 'tester', 'testing', 'automation', 'sdet', 'selenium', 'cypress', 'playwright'],
    phrases: ['test automation', 'quality engineering'],
    reply:
      "Quality engineering at the India GCC covers test strategy, automation (web, API, data), performance, and accessibility. SDETs work alongside engineers — quality is a build-time concern, not an end-of-cycle gate.",
  },
  {
    id: 'mobile',
    any: ['mobile', 'ios', 'android', 'swift', 'kotlin', 'flutter', 'react-native'],
    phrases: ['react native', 'mobile app'],
    reply:
      "Mobile work supports member-facing apps and store-floor tooling. We hire across iOS (Swift), Android (Kotlin), and cross-platform stacks where they make sense.",
  },
  {
    id: 'design',
    any: ['design', 'designer', 'ux', 'ui', 'research', 'productdesigner'],
    patterns: [/(product|service|ux|ui) design/i, /design system/i],
    reply:
      "Product and service designers shape member-first experiences across web, app, and store technologies. Design partners closely with research, engineering, and operations — and yes, we run regular critiques.",
  },
  {
    id: 'product-management',
    any: ['pm', 'product-manager', 'roadmap', 'okr', 'okrs', 'okrs', 'strategy'],
    patterns: [/product management/i, /product owner/i, /product manager/i],
    reply:
      "Product Management at the India GCC partners with engineering, design, and business stakeholders to shape outcomes — not just features. We use OKRs and outcome-led roadmaps; deep curiosity about members and operators is the most important trait.",
  },
  {
    id: 'ops-finance',
    any: ['operations', 'merchandising', 'supply', 'logistics', 'inventory', 'finance', 'accounting', 'process'],
    patterns: [/supply chain/i, /finance ops/i],
    reply:
      "Operations and finance technology covers predictive inventory and merchandising, omnichannel fulfilment, supply chain, and finance & accounting ops. We pair lean process design with strong tooling so partners worldwide can move with confidence.",
  },
  {
    id: 'sre-observability',
    any: ['observability', 'monitoring', 'oncall', 'on-call', 'sre', 'reliability', 'prometheus', 'grafana', 'opentelemetry', 'otel'],
    patterns: [/site reliability/i, /on call/i],
    reply:
      "SRE and observability cover golden-signal SLOs, incident response, on-call, and platform reliability. Tooling is pragmatic — Prometheus / Grafana / OpenTelemetry style — with clear runbooks and blameless postmortems.",
  },
  {
    id: 'hackathons',
    any: ['hackathon', 'hackathons', 'innovation', 'patents'],
    patterns: [/innovation (day|jam)/i],
    reply:
      "We run regular hackathons and innovation jams — the best ideas have a way of becoming real systems Costco uses. Engineers, designers, data folks, and ops mix freely; the bar is curiosity, not seniority.",
  },

  // ----------------------------- Location & office -----------------------------
  {
    id: 'locations',
    any: ['location', 'office', 'city', 'campus', 'address', 'based', 'madhapur', 'hyderabad', 'capitaland', 'telangana', 'hitech', 'hitec'],
    patterns: [/where (are|is) you/i, /where.*located/i, /where.*office/i, /how do i (reach|get to)/i],
    phrases: ['where are you', 'where is the office', 'where located', 'office address'],
    reply:
      "Our office is at Capitaland, Madhapur, Hyderabad — Telangana, India. It's our single GCC location, in the heart of Hyderabad's tech corridor near Hitech City and the Hitech City metro.",
    followups: ['Are roles hybrid or onsite?', 'Are there office amenities?', 'How do I apply?'],
  },
  {
    id: 'office-amenities',
    any: ['cafeteria', 'cafe', 'food', 'gym', 'parking', 'shuttle', 'creche', 'transport', 'amenities'],
    patterns: [/free (food|meals|lunch)/i, /office (gym|cafeteria|amenities)/i],
    reply:
      "The Madhapur campus has modern collaboration and focus zones, with cafeteria, wellness amenities, and connected transport options around the Hitech City corridor. Specifics evolve as the campus matures — your recruiter can share current details.",
  },
  {
    id: 'shifts-hours',
    any: ['shift', 'shifts', 'hours', 'timezone', 'overlap'],
    patterns: [/working hours/i, /us overlap/i, /uk overlap/i, /night shift/i],
    reply:
      "Most India GCC roles run on India business hours with intentional overlap into US Pacific (Issaquah HQ) for the teams that need it. A few support and ops functions cover broader windows. No mandatory night shifts as a default.",
  },
  {
    id: 'hybrid-remote',
    any: ['hybrid', 'remote', 'wfh', 'onsite', 'inoffice', 'in-office'],
    phrases: ['work from home', 'in office', 'hybrid model'],
    reply:
      "We work in a hybrid model anchored at our Hyderabad campus. Specifics vary by role and team — your recruiter shares details after you apply on Talent500.",
    followups: ['Where is the office?', 'How do I apply?'],
  },
  {
    id: 'dress-code',
    any: ['dress', 'dresscode', 'attire', 'wear', 'clothing'],
    patterns: [/dress code/i, /what to wear/i],
    reply:
      "Smart casual is the norm. Dress for the day — comfortable for focus work, presentable when partners or visitors are around. No formal suit-and-tie requirement.",
  },
  {
    id: 'language',
    any: ['english', 'language', 'hindi', 'telugu'],
    patterns: [/working language/i, /office language/i],
    reply:
      "English is the working language for cross-team collaboration. Many colleagues speak Hindi and Telugu day-to-day; that's part of the texture, not a requirement.",
  },
  {
    id: 'holidays-festivals',
    any: ['holiday', 'holidays', 'festival', 'diwali', 'sankranti', 'pongal', 'christmas'],
    patterns: [/festival list/i, /holiday calendar/i, /paid holidays/i],
    reply:
      "We follow an India holiday calendar with major regional and national festivals (Diwali, Sankranti, Holi, Eid, Christmas, etc.) plus statutory holidays. Specific dates are shared on internal channels each year.",
  },

  // ----------------------------- Careers -----------------------------
  {
    id: 'careers-apply',
    any: ['career', 'careers', 'job', 'jobs', 'apply', 'opening', 'openings', 'role', 'roles', 'vacancy', 'hiring', 'talent500', 'recruit'],
    patterns: [/how do i (apply|get a job)/i, /open roles/i],
    phrases: ['how do i apply', 'apply for a job', 'open roles', 'job openings'],
    reply:
      `Costco India GCC hiring is facilitated by Talent500. The full live list — currently around 30 roles in Hyderabad across Engineering, Data, Cloud, Quality, MarTech, Product, and Security — lives at ${careersUrl}. The Careers section on this page mirrors them with skill chips.`,
    followups: ['What is the interview process?', 'Do you sponsor relocation?', 'Are roles hybrid or remote?'],
  },
  {
    id: 'interview',
    any: ['interview', 'round', 'rounds', 'assessment', 'loop', 'panel', 'screening', 'coding'],
    patterns: [/interview process/i, /technical round/i],
    reply:
      "A typical loop: recruiter chat → technical screen → 2–4 deep technical/domain rounds → hiring-manager conversation → values-alignment round. Specifics vary by role; your recruiter shares the exact plan after you apply.",
    followups: ['How do I apply?', 'Do you sponsor relocation?'],
  },
  {
    id: 'relocation',
    any: ['relocation', 'reloc', 'moving', 'transfer', 'relocate'],
    patterns: [/relocation (support|assistance|allowance)/i],
    reply:
      "Relocation support is offered for many roles where it's needed. Specifics depend on the role and level — confirm with your recruiter.",
  },
  {
    id: 'visa',
    any: ['visa', 'sponsorship', 'h1b', 'h-1b', 'work-permit', 'permit'],
    patterns: [/visa sponsor/i, /work permit/i, /relocate to (us|usa|america|uk)/i],
    reply:
      "India GCC roles are based in Hyderabad and don't require a visa for Indian residents. We don't sponsor work visas to other countries from these roles. Costco's other geographies hire and sponsor under their own local rules.",
  },
  {
    id: 'compensation',
    any: ['salary', 'compensation', 'pay', 'ctc', 'package', 'stock', 'rsu', 'bonus', 'esop'],
    patterns: [/how much.*pay/i, /pay range/i],
    reply:
      "We offer competitive, market-aligned compensation with comprehensive benefits and learning support. Specific ranges are role- and level-dependent and are discussed with your recruiter — and yes, we're disciplined about pay equity.",
  },
  {
    id: 'levels',
    any: ['level', 'levels', 'title', 'titles', 'designation', 'band'],
    patterns: [/career ladder/i, /promotion cycle/i],
    reply:
      "Levels reflect scope and impact rather than tenure alone. Engineering ladders span IC and management tracks; promotions are driven by demonstrated impact in role plus partner feedback. Specifics are shared as part of the offer conversation.",
  },
  {
    id: 'freshers-interns',
    any: ['fresher', 'freshers', 'intern', 'internship', 'graduate', 'newgrad'],
    patterns: [/(new |fresh )?grad(uate)?/i, /campus hiring/i, /internship program/i],
    phrases: ['new grad'],
    reply:
      "We hire from campuses and welcome interns across engineering, data, and design. Watch the Talent500 portal for early-career and intern openings as they open.",
  },
  {
    id: 'referral',
    any: ['referral', 'refer', 'employee-referral'],
    patterns: [/refer a friend/i, /referral bonus/i],
    reply:
      "Employee referrals are a strong source of hires here. If you know someone at Costco India GCC, ask them to refer you through the internal program — it speeds your application up the queue.",
  },
  {
    id: 'notice-period',
    any: ['notice', 'notice-period', 'serving', 'lwd'],
    patterns: [/notice period/i, /how soon can you join/i, /buy out/i, /buyout/i],
    reply:
      "We're flexible on notice periods — share what's realistic with your recruiter. In some cases buy-outs may be considered; this is decided role-by-role.",
  },
  {
    id: 'background-check',
    any: ['bgv', 'background', 'verification'],
    patterns: [/background (check|verification)/i, /reference check/i],
    reply:
      "All offers are subject to standard background verification (employment, education, identity, address, criminal record). It's a routine part of joining and the talent acquisition team walks you through the steps.",
  },
  {
    id: 'moonlighting',
    any: ['moonlight', 'moonlighting', 'sidegig', 'side-gig', 'freelance'],
    patterns: [/dual employment/i, /second job/i, /moonlighting policy/i],
    reply:
      "Like most large employers, we expect employees to be working only for Costco during their tenure (no dual employment). Personal projects and open-source contributions are typically fine — disclose anything that might create a conflict of interest.",
  },
  {
    id: 'benefits',
    any: ['benefits', 'perks', 'health', 'insurance', 'wellness', 'leave', 'parental', 'maternity', 'paternity', 'pf', 'provident', 'gratuity'],
    patterns: [/health (cover|insurance)/i, /provident fund/i],
    reply:
      "Benefits include comprehensive health cover for you and dependents, parental leave, mental wellness support, learning budgets, internal mobility, and a culture that values work–life balance.",
  },
  {
    id: 'l-and-d',
    any: ['learning', 'training', 'certifications', 'certification', 'pluralsight', 'coursera', 'mentorship', 'mentor'],
    patterns: [/learning (and|&) development/i, /l&d/i, /upskill/i, /reskill/i],
    reply:
      "Learning is part of the job. Engineers and ops folks here use a mix of internal sessions, external platforms, and certification support — plus mentorship that's actually structured, not just goodwill.",
  },
  {
    id: 'performance-review',
    any: ['review', 'appraisal', 'feedback'],
    patterns: [/performance (review|cycle|appraisal)/i, /how often.*review/i],
    reply:
      "Performance is reviewed on a regular cadence with continuous feedback in between. The conversation is grounded in scope, outcomes, and partner signals — not just a numeric rating.",
  },

  // ----------------------------- Culture / DEI -----------------------------
  {
    id: 'culture',
    any: ['culture', 'life', 'environment', 'vibe'],
    patterns: [/work[- ]life balance/i, /life at costco/i, /life at the gcc/i],
    phrases: ['life at costco', 'work life balance'],
    reply:
      "Life at Costco India is built on care, craft, and community: inclusive teams, learning culture, employee resource groups, hackathons, family days, and a deep respect for our members and each other.",
    followups: ['What benefits do you offer?', 'Tell me about diversity & inclusion'],
  },
  {
    id: 'diversity-erg',
    any: ['inclusion', 'belonging', 'diversity', 'dei', 'erg', 'lgbtq', 'pride', 'women', 'neurodiversity'],
    patterns: [/employee resource group/i, /women in tech/i],
    reply:
      "Belonging is intentional. We support employee resource groups (women in tech, pride, neurodiversity, parents, and more), inclusive hiring practices, and accessibility-first product work. The aim is workplaces where people do their best work as themselves.",
  },
  {
    id: 'posh',
    any: ['posh', 'harassment', 'icc'],
    patterns: [/sexual harassment/i, /internal complaints/i],
    reply:
      "We comply with India's POSH Act, 2013, and have an Internal Complaints Committee (ICC). Concerns can be raised through the ICC, your manager, HR, or the whistleblower channels in the footer — confidentially and without retaliation.",
  },
  {
    id: 'awards',
    any: ['award', 'recognition', 'gptw', 'certified', 'top-employer'],
    phrases: ['great place to work'],
    reply:
      "We aim for industry recognitions like Great Place to Work and ISO 27001, and we measure ourselves against the standards Costco is famous for.",
  },

  // ----------------------------- ESG / CSR -----------------------------
  {
    id: 'esg',
    any: ['esg', 'csr', 'sustainability', 'sustainable', 'climate', 'environment', 'community', 'social', 'governance', 'carbon', 'green', 'emissions', 'netzero', 'sbti'],
    phrases: ['climate action', 'climate goals', 'science based targets', 'net zero', 'net-zero'],
    reply:
      "Costco committed to net-zero greenhouse-gas emissions across the value chain by 2050, with SBTi-approved interim targets: a 39% absolute reduction in Scope 1 + 2 by 2030 (vs 2020) and 20% intensity reduction in selected Scope 3 categories. The company also targets 100% renewable electricity by 2035.",
    followups: ['Tell me about culture', 'How do I report an ethics concern?'],
  },

  // ----------------------------- Ethics / Whistleblower -----------------------------
  {
    id: 'whistleblower',
    any: ['whistleblower', 'complaint', 'grievance', 'misconduct', 'harassment', 'retaliation', 'fraud', 'bribery'],
    patterns: [/report (a|an) (concern|issue|incident|wrongdoing)/i, /raise.*concern/i],
    phrases: ['report a concern', 'report concern'],
    reply:
      "Concerns can be raised confidentially. See the Whistleblower page in the footer for available channels, including anonymous reporting. Costco does not tolerate retaliation against good-faith reporters.",
    followups: ['What is the Code of Ethics?'],
  },

  // ----------------------------- Privacy / Cookies -----------------------------
  {
    id: 'privacy',
    any: ['privacy', 'gdpr', 'dpdp', 'protection', 'pii', 'personal'],
    phrases: ['data protection', 'privacy policy', 'dpdp act'],
    reply:
      "We follow Costco's global privacy principles and are aware of GDPR and India's DPDP Act, 2023. See the Privacy notice and Cookies pages in the footer for details. This site uses only essential cookies by default.",
    followups: ['How do I change cookie settings?'],
  },
  {
    id: 'cookies',
    any: ['cookie', 'cookies', 'tracker', 'tracking', 'consent'],
    patterns: [/cookie (settings|preferences|policy)/i],
    reply:
      "We use only strictly necessary cookies by default. With your consent we may also use Preferences, Analytics, and Marketing cookies — toggle these any time via the shield icon at the bottom-left, or 'Preferences' in the consent banner.",
  },
  {
    id: 'data-residency',
    any: ['residency', 'localization', 'region'],
    patterns: [/data residency/i, /data localization/i, /where.*data stored/i],
    reply:
      "We follow Costco's global data-handling standards together with India's DPDP requirements. Specific residency and processing details depend on the system; the Privacy notice in the footer is the canonical reference.",
  },

  // ----------------------------- Theme / site features -----------------------------
  {
    id: 'theme',
    any: ['theme', 'palette', 'colour', 'color', 'dark', 'light'],
    patterns: [/dark mode/i, /light mode/i, /change (theme|colou?r|mode)/i],
    reply:
      "Tap the palette icon in the navbar to switch between Costco, Sunset, Forest, Ocean, and Mono palettes — and Light / Dark / System mode. Choices are saved on your device.",
  },
  {
    id: 'a11y',
    any: ['accessibility', 'a11y', 'screen-reader', 'wcag', 'keyboard'],
    patterns: [/screen reader/i, /accessibility statement/i],
    reply:
      "We target WCAG 2.2 AA: skip-to-main, visible focus, semantic landmarks, reduced-motion support, labelled forms, and keyboard-friendly navigation. See the Accessibility statement in the footer for details and feedback.",
  },

  // ----------------------------- Contact / Press / Vendor -----------------------------
  {
    id: 'contact',
    any: ['contact', 'email', 'phone', 'reach', 'talk', 'connect'],
    patterns: [/get in touch/i, /how do i contact/i],
    phrases: ['get in touch', 'how do i contact'],
    reply:
      "Use the Contact section on this page — pick a topic (General, Partnership, Press, Careers, Vendor) and send us a message. Submitting opens your email client; nothing is sent from this page.",
    followups: ['Where are you located?', 'How do I apply?'],
  },
  {
    id: 'press-media',
    any: ['press', 'media', 'journalist', 'reporter', 'pr'],
    patterns: [/press release/i, /media inquiry/i],
    reply: "For press and media, use the Contact form and select 'Press' as the topic. We respond as quickly as we can.",
  },
  {
    id: 'vendor',
    any: ['vendor', 'supplier', 'partnership', 'partner', 'procure', 'rfp', 'rfq'],
    patterns: [/become a (vendor|supplier|partner)/i],
    reply:
      "For vendor, supplier, or partnership inquiries, use the Contact form and select 'Vendor / Supplier' or 'Partnership'. Costco's supplier diligence aligns with our global Code of Ethics.",
  },

  // ----------------------------- Small talk / deflects -----------------------------
  {
    id: 'thanks',
    any: ['thanks', 'thank', 'thx', 'appreciate', 'cheers'],
    patterns: [/thank you/i, /much appreciated/i],
    reply: "You're welcome! Anything else I can help with?",
  },
  {
    id: 'bye',
    patterns: [/^(bye|goodbye|see ?you|cya|catch you)/i],
    reply: 'Goodbye! Come back any time — and best of luck if you apply on Talent500.',
  },
  {
    id: 'help',
    patterns: [/^help$/i, /im stuck|i'm stuck|not sure|confused|lost/i],
    reply:
      "Try: 'Where are you located?', 'How do I apply?', 'Who is the CEO?', 'Tell me about Costco', 'What is Kirkland Signature?', 'Tell me about life at Costco'.",
    followups: ['Where are you located?', 'How do I apply?', 'Who is the CEO?'],
  },
  {
    id: 'joke',
    any: ['joke', 'funny', 'humor', 'humour'],
    patterns: [/tell.*joke/i, /make me laugh/i],
    reply:
      "Why did the GCC engineer love Costco? Because the deployments come in bulk. (I'll show myself out.)",
    followups: ['Tell me about Costco', 'What does the GCC do?'],
  },
  {
    id: 'weather-time',
    any: ['weather', 'temperature', 'time', 'date', 'today'],
    patterns: [/what time is it/i, /what.*weather/i, /what.*date/i],
    reply:
      "I don't have live weather or time data — I'm a static on-page guide. Ask me about Costco, the GCC, careers, or life here, and I'll do my best.",
  },
  {
    id: 'feedback',
    any: ['feedback', 'suggest', 'suggestion', 'improve', 'broken', 'bug'],
    patterns: [/found a bug/i, /report.*bug/i, /site issue/i],
    reply:
      "Thanks for the nudge! For accessibility issues, the Accessibility statement in the footer has a contact email. For everything else, the Contact form is the right route.",
  },
];

export const fallback = {
  reply:
    "I'm not sure I caught that. I can talk about Costco facts, the India GCC, our Hyderabad office, capabilities, careers, life at Costco, ESG, ethics, privacy, or how to get in touch — pick a thread below or rephrase.",
  followups: ['Tell me about Costco', 'What does the GCC do?', 'Where are you located?', 'How do I apply for jobs?'],
};

// ---------------- Matcher ----------------

const STOP = new Set([
  'the','a','an','of','to','in','on','for','and','or','is','are','was','were',
  'i','you','we','it','do','does','did','tell','me','about','have','has','can',
  'could','will','would','should','may','might','what','where','when','who','how',
  'why','please','this','that','these','those','my','our','your','their','there',
  'so','as','at','be','been','being','than','then','just','any','some','one'
]);

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'@./-]+/gu, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

// Light Porter-ish stem: strip a handful of common english suffixes.
// Order matters — try longest suffix first so e.g. "stores" strips just
// the trailing 's' rather than greedily stripping 'es' to 'stor'.
function stem(t: string) {
  if (t.length < 4) return t;
  if (t.length >= 5 && t.endsWith('ies')) return t.slice(0, -3) + 'y';
  if (t.length >= 5 && t.endsWith('ied')) return t.slice(0, -3) + 'y';
  if (t.endsWith('sses')) return t.slice(0, -2); // classes → class
  if (t.length >= 6 && t.endsWith('ing')) return t.slice(0, -3);
  if (t.length >= 5 && t.endsWith('ed')) return t.slice(0, -2);
  if (t.endsWith('s') && !t.endsWith('ss') && t.length >= 4) return t.slice(0, -1);
  return t;
}

// Damerau-Levenshtein with early-exit cap. Used only for short comparisons,
// so cost stays trivial.
function editDistance(a: string, b: string, cap: number): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (
        i > 1 && j > 1 &&
        a.charCodeAt(i - 1) === b.charCodeAt(j - 2) &&
        a.charCodeAt(i - 2) === b.charCodeAt(j - 1)
      ) {
        curr[j] = Math.min(curr[j], prev[j - 1] /* before swap */);
      }
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > cap) return cap + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function fuzzyMatch(token: string, key: string): number {
  if (token === key) return 1;
  const ts = stem(token), ks = stem(key);
  if (ts === ks) return 0.85;
  if (key.length >= 5 && (token.includes(key) || key.includes(token))) return 0.7;
  // Allow 1 typo for tokens of length 5+; 2 for 8+.
  const cap = key.length >= 8 && token.length >= 8 ? 2 : key.length >= 5 ? 1 : 0;
  if (cap === 0) return 0;
  const d = editDistance(token, key, cap);
  if (d <= cap) return 0.55 - (d - 1) * 0.1;
  // also try the stems, slightly cheaper
  if (ks.length >= 5) {
    const d2 = editDistance(ts, ks, 1);
    if (d2 <= 1) return 0.45;
  }
  return 0;
}

function score(input: string, intent: Intent) {
  const toks = tokens(input);
  let s = 0;

  // Score by INPUT TOKEN, not by intent key — so a single token like
  // "stores" can't score twice against both 'store' and 'stores' keys.
  // Each token contributes at most once per intent (its best match).
  if (intent.any?.length) {
    const keys = intent.any.map((k) => k.toLowerCase());
    for (const t of toks) {
      let best = 0;
      for (const key of keys) {
        const sim = fuzzyMatch(t, key);
        if (sim > best) best = sim;
        if (best === 1) break; // can't beat exact
      }
      if (best > 0) s += best * 3;
    }
  }

  if (intent.phrases?.length) {
    const lower = input.toLowerCase();
    for (const p of intent.phrases) if (lower.includes(p.toLowerCase())) s += 4;
  }

  if (intent.patterns?.length) {
    for (const re of intent.patterns) if (re.test(input)) s += 5;
  }

  return s;
}

export type AnswerOpts = { recentIntents?: string[] };

export function answer(input: string, opts: AnswerOpts = {}): { reply: string; followups?: string[]; intentId?: string } {
  const text = (input || '').trim();
  if (!text) return { reply: 'Type a question and press Enter — try "Who is the CEO?"', followups: fallback.followups };

  const recent = new Set((opts.recentIntents || []).filter(Boolean));

  let best: { intent: Intent | null; s: number } = { intent: null, s: 0 };
  let runnerUp: { intent: Intent | null; s: number } = { intent: null, s: 0 };
  for (const it of intents) {
    let s = score(text, it);
    // Recency penalty: don't echo what we just said unless the signal is strong.
    if (s > 0 && recent.has(it.id)) s *= 0.45;
    if (s > best.s) { runnerUp = best; best = { intent: it, s }; }
    else if (s > runnerUp.s) { runnerUp = { intent: it, s } as any; }
  }

  // Threshold: a single stem-matched keyword (~2.55) crosses; pure substring
  // matches (~2.1) and edit-distance fuzzies (~1.65) need a second signal.
  if (best.intent && best.s >= 2.5) {
    return { reply: best.intent.reply, followups: best.intent.followups, intentId: best.intent.id };
  }
  return { reply: fallback.reply, followups: fallback.followups };
}
