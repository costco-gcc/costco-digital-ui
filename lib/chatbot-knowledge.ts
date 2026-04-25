// Lightweight, fully client-side intent matcher for "Kirky".
// No API calls, no PII collection. Runs entirely in the browser on a static
// export. Knowledge base mirrors Costco's published facts (CEO, members, fees,
// countries, climate goals) and India GCC specifics (Hyderabad, Rajeev Mall,
// scope, hiring partner).

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
    any: ['hi', 'hello', 'hey', 'namaste', 'howdy', 'yo', 'hola'],
    patterns: [/good (morning|afternoon|evening)/i],
    reply:
      "Hi, I'm Kirky — your Costco India GCC guide. I can help with Costco facts, our Hyderabad office, capabilities, careers, life at Costco, ESG, ethics, and contact info.",
    followups: ['Tell me about Costco', 'What does the GCC do?', 'Where are you located?', 'How do I apply for jobs?'],
  },
  {
    id: 'who-is-kirky',
    any: ['kirky', 'name', 'bot', 'who'],
    patterns: [/who (are|is) you/i, /your name/i, /why kirky/i, /name.*bot/i],
    phrases: ['who are you', 'what is your name'],
    reply:
      "I'm Kirky — named after Kirkland, Washington, where Costco was once headquartered and which lent its name to the Kirkland Signature brand (launched 1995). I'm a generic, on-page assistant with no AI server behind me.",
    followups: ['What is Kirkland Signature?', 'Tell me about Costco', 'What can you help with?'],
  },
  {
    id: 'capabilities-bot',
    patterns: [/what can you (do|help)/i, /how can you help/i, /menu|options/i, /what.*topics/i, /^help$/i],
    reply:
      "I can answer: Costco facts (CEO, members, revenue, countries, Kirkland Signature), India GCC (Hyderabad office, leadership, capabilities), careers and the interview process, life at Costco, ESG, ethics & whistleblower, privacy & cookies, and contact info.",
    followups: ['Tell me about the GCC', 'Who is the CEO?', 'How many members does Costco have?'],
  },

  // ----------------------------- Costco corporate -----------------------------
  {
    id: 'costco-corp',
    any: ['costco', 'company', 'history', 'story', 'about'],
    phrases: ['about costco', 'costco history', 'tell me about costco'],
    reply:
      "Costco Wholesale Corporation is a membership warehouse club founded on September 15, 1983 by James Sinegal and Jeffrey Brotman. It's headquartered in Issaquah, Washington, and operates 924+ warehouses across 11 countries (as of March 2026). FY2024 revenue was about $254 billion.",
    followups: ['Who is the CEO?', 'What is Kirkland Signature?', "What is Costco's mission?", 'Tell me about the GCC'],
  },
  {
    id: 'ceo',
    any: ['ceo', 'president', 'leader', 'vachris'],
    phrases: ['who is the ceo', 'who runs costco', 'who leads costco'],
    reply:
      "Ron Vachris is President & CEO of Costco Wholesale, since January 2024. He's only the third CEO in Costco's history — joining the company in 1982 as a forklift driver at a Price Club in Arizona before rising to the top.",
    followups: ['Tell me about Costco', "What is Costco's mission?"],
  },
  {
    id: 'india-leader',
    any: ['rajeev', 'mall', 'india ceo', 'gcc ceo', 'india leader'],
    phrases: ['india ceo', 'india gcc ceo'],
    reply:
      "Rajeev Mall leads the Costco India GCC as its CEO. He joined from Mondelēz International, where he was VP, Global Business Services; before that, Group CIO at Coca-Cola Bottlers Japan and President of Coca-Cola Bottlers Japan Business Services.",
    followups: ['Where is the India GCC located?', 'How many people does the India GCC have?'],
  },
  {
    id: 'mission',
    any: ['mission', 'purpose', 'vision'],
    phrases: ['mission statement'],
    reply:
      "Costco's mission is to continually provide members with quality goods and services at the lowest possible prices. Everything else — operating model, sourcing, employee practices — flows from that promise.",
    followups: ['What is the Code of Ethics?', 'Tell me about membership'],
  },
  {
    id: 'code-of-ethics',
    any: ['ethic', 'ethical', 'code', 'principle', 'values', 'integrity'],
    phrases: ['code of ethics'],
    reply:
      "Costco's Code of Ethics has four principles: 1) Obey the law, 2) Take care of our members, 3) Take care of our employees, 4) Respect our suppliers. Live these and the fifth follows: reward shareholders. The India GCC operates under exactly the same code.",
    followups: ["What is Costco's mission?", 'How do I report an ethics concern?'],
  },
  {
    id: 'kirkland-signature',
    any: ['kirkland', 'signature', 'private', 'label', 'house'],
    phrases: ['kirkland signature', 'private label'],
    reply:
      "Kirkland Signature is Costco's private label, launched in 1995 and named after Costco's former Kirkland, Washington headquarters. It accounts for roughly a third of company sales and is held to a higher standard than the national brands it competes with.",
    followups: ['Why are you called Kirky?'],
  },
  {
    id: 'founders-hq',
    any: ['founder', 'founded', 'started', 'history', 'old', 'sinegal', 'brotman', 'issaquah'],
    phrases: ['who founded', 'when founded', 'where headquartered'],
    reply:
      "Costco was founded September 15, 1983 by James (Jim) Sinegal and Jeffrey Brotman, and is headquartered in Issaquah, Washington, USA. India leadership is listed in the Leadership section.",
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
    any: ['warehouse', 'store', 'country', 'countries', 'global', 'worldwide', 'how many'],
    phrases: ['how many warehouses', 'how many countries', 'how many stores'],
    reply:
      "Costco operates 924+ warehouses across 11 countries as of March 2026 — about 85% in North America. Markets include the United States, Canada, Mexico, the United Kingdom, Japan, Korea, Australia, Spain, France, Iceland, China, and Taiwan.",
    followups: ['Where is the India GCC located?', 'Tell me about Costco'],
  },
  {
    id: 'revenue',
    any: ['revenue', 'sales', 'turnover', 'earnings', 'financials', 'fiscal'],
    phrases: ['fy2024 revenue', 'how much money does costco make'],
    reply:
      "Costco reported approximately $254 billion in revenue for fiscal year 2024 — up about 5% year over year. Most of that is grocery and consumer goods, with a long-running mission of low markups and quality.",
  },

  // ----------------------------- About the India GCC -----------------------------
  {
    id: 'about-gcc',
    any: ['gcc', 'capability', 'india gcc', 'global capability'],
    phrases: ['what does the gcc do', 'about the gcc', 'costco india'],
    reply:
      "Costco Wholesale India Private Limited is Costco's Global Capability Center — based at Capitaland, Madhapur, Hyderabad. We unite People, Technology, and Process to power Costco worldwide: predictive inventory, membership analytics, omnichannel fulfilment, and cybersecurity, plus engineering, data, AI, and finance ops.",
    followups: ['What capabilities do you have?', 'Where are you located?', 'Tell me about life at Costco'],
  },
  {
    id: 'why-india',
    patterns: [/why india/i, /why hyderabad/i, /why a gcc/i],
    reply:
      "India is the world's largest GCC ecosystem. Hyderabad pairs deep engineering and operations talent with strong policy support and 24×7 coverage — a fit for Costco's quality-at-scale operating style.",
    followups: ['Where exactly is the office?', 'What capabilities do you have?'],
  },
  {
    id: 'india-headcount',
    any: ['headcount', 'employees', 'people', 'team size', 'workforce', '1000', 'thousand'],
    phrases: ['how many employees', 'how big is the gcc'],
    reply:
      "The India GCC plans to scale to ~1,000 employees in Hyderabad, hiring across engineering, data, AI, cloud, security, ops, and finance. The list of live roles is in the Careers section.",
  },

  // ----------------------------- Capabilities -----------------------------
  {
    id: 'capabilities',
    any: ['capabilities', 'services', 'domains', 'functions', 'offerings'],
    patterns: [/what.*do you (do|build)/i],
    reply:
      "Three pillars: People (membership analytics, member services, trust & risk), Technology (cloud + SRE on GCP/BigQuery/GKE, data + lakehouse, AI/ML & GenAI), and Process (predictive inventory & merchandising, omnichannel fulfilment, finance & accounting tech).",
    followups: ['Tell me about engineering', 'Tell me about AI/ML work', 'Tell me about data work'],
  },
  {
    id: 'engineering',
    any: ['engineering', 'engineer', 'software', 'developer', 'sre', 'platform', 'cloud', 'devops', '.net', 'c#', 'java', 'spring', 'react', 'frontend', 'backend'],
    reply:
      "Engineering at the India GCC spans cloud platforms and SRE, distributed systems (Java/Spring, C#/.NET Core), modern web (React/front-end), observability, and developer experience. Live roles often touch GitHub Actions, Jenkins, Docker, Terraform, GCP/GKE.",
    followups: ['Tell me about data work', 'Tell me about AI/ML work', 'How do I apply?'],
  },
  {
    id: 'data',
    any: ['data', 'lakehouse', 'analytics', 'pipelines', 'spark', 'kafka', 'bigquery', 'snowflake', 'etl', 'elt', 'pub/sub', 'dataflow'],
    reply:
      "Data engineering powers personalization, inventory, finance, and operations. Patterns include streaming and batch pipelines on GCP / BigQuery / Pub/Sub / Dataflow, contract-driven data products, ELT/ETL with Java and Python, and a strong focus on data quality.",
    followups: ['Tell me about AI/ML work', 'How do I apply?'],
  },
  {
    id: 'ai-ml',
    any: ['ai', 'ml', 'artificial', 'intelligence', 'machine', 'learning', 'genai', 'llm', 'nlp', 'vision', 'model', 'martech', 'adtech'],
    phrases: ['gen ai', 'machine learning'],
    reply:
      "AI/ML at the India GCC focuses on member experience, operations, and forecasting — applied responsibly. We work on classical ML and Generative AI with strong evaluations, guardrails, and human-in-the-loop where it matters most. MarTech / AdTech (incl. Adobe Experience Platform) is an active area.",
    followups: ['Tell me about data work', 'Tell me about security work', 'How do I apply?'],
  },
  {
    id: 'security',
    any: ['security', 'cyber', 'infosec', 'appsec', 'trust', 'risk', 'fraud', 'compliance', 'grc'],
    reply:
      "Cybersecurity, trust, and risk teams keep members safe and the business resilient — covering identity, application security, fraud, threat intel, GRC, and incident response. We align with ISO 27001 principles and Costco's global security standards.",
  },
  {
    id: 'design',
    any: ['design', 'designer', 'ux', 'ui', 'research', 'product designer'],
    reply:
      "Product and service designers shape member-first experiences across web, app, and store technologies. Design partners closely with research, engineering, and operations — and yes, we run regular critiques.",
  },
  {
    id: 'ops-finance',
    any: ['operations', 'merchandising', 'supply', 'logistics', 'inventory', 'finance', 'accounting', 'process'],
    reply:
      "Operations and finance technology covers predictive inventory and merchandising, omnichannel fulfilment, supply chain, and finance & accounting ops. We pair lean process design with strong tooling so partners worldwide can move with confidence.",
  },

  // ----------------------------- Location -----------------------------
  {
    id: 'locations',
    any: ['where', 'location', 'office', 'city', 'campus', 'address', 'based', 'madhapur', 'hyderabad', 'capitaland', 'telangana', 'hitec'],
    phrases: ['where are you', 'where is the office', 'where located'],
    reply:
      "Our office is at Capitaland, Madhapur, Hyderabad — Telangana, India. It's our single GCC location, in the heart of Hyderabad's tech corridor near Hitech City.",
    followups: ['Are roles hybrid or onsite?', 'How do I apply?', 'How do I get in touch?'],
  },
  {
    id: 'hybrid-remote',
    any: ['hybrid', 'remote', 'wfh', 'onsite', 'in-office', 'work from home'],
    phrases: ['work from home', 'in office', 'hybrid model'],
    reply:
      "We work in a hybrid model anchored at our Hyderabad campus. Specifics vary by role and team — your recruiter shares details after you apply on Talent500.",
  },

  // ----------------------------- Careers -----------------------------
  {
    id: 'careers-apply',
    any: ['career', 'careers', 'job', 'jobs', 'apply', 'opening', 'role', 'vacancy', 'hiring', 'talent500'],
    phrases: ['how do i apply', 'apply for a job', 'open roles'],
    reply:
      `Costco India GCC hiring is facilitated by Talent500. The full live list — currently around 30 roles in Hyderabad across Engineering, Data, Cloud, Quality, MarTech, Product, and Security — lives at ${careersUrl}. The Careers section on this page mirrors them with skill chips.`,
    followups: ['What is the interview process?', 'Do you sponsor relocation?', 'Are roles hybrid or remote?'],
  },
  {
    id: 'interview',
    any: ['interview', 'round', 'assessment', 'loop', 'panel', 'screening'],
    reply:
      "A typical loop: recruiter chat → technical screen → 2–4 deep technical/domain rounds → hiring-manager conversation → values-alignment round. Specifics vary by role; your recruiter shares the exact plan after you apply.",
  },
  {
    id: 'relocation',
    any: ['relocation', 'reloc', 'moving', 'transfer', 'relocate'],
    reply:
      "Relocation support is offered for many roles where it's needed. Specifics depend on the role and level — confirm with your recruiter.",
  },
  {
    id: 'compensation',
    any: ['salary', 'compensation', 'pay', 'ctc', 'package', 'stock', 'rsu', 'bonus'],
    reply:
      "We offer competitive, market-aligned compensation with comprehensive benefits and learning support. Specific ranges are role- and level-dependent and are discussed with your recruiter.",
  },
  {
    id: 'freshers-interns',
    any: ['fresher', 'freshers', 'intern', 'internship', 'graduate', 'campus', 'newgrad'],
    phrases: ['new grad'],
    reply:
      "We hire from campuses and welcome interns across engineering, data, and design. Watch the Talent500 portal for early-career and intern openings as they open.",
  },
  {
    id: 'benefits',
    any: ['benefits', 'perks', 'health', 'insurance', 'wellness', 'leave', 'parental', 'maternity', 'paternity', 'pf', 'provident'],
    reply:
      "Benefits include comprehensive health cover for you and dependents, parental leave, mental wellness support, learning budgets, internal mobility, and a culture that values work–life balance.",
  },

  // ----------------------------- Culture -----------------------------
  {
    id: 'culture',
    any: ['culture', 'life', 'work-life', 'balance', 'environment', 'vibe', 'inclusion', 'belonging', 'diversity', 'dei', 'erg'],
    phrases: ['life at costco', 'work life balance'],
    reply:
      "Life at Costco India is built on care, craft, and community: inclusive teams, learning culture, employee resource groups, hackathons, family days, and a deep respect for our members and each other.",
    followups: ['What benefits do you offer?', 'Tell me about ESG/CSR'],
  },
  {
    id: 'awards',
    any: ['award', 'recognition', 'gptw', 'certified', 'top employer'],
    phrases: ['great place to work'],
    reply:
      "We aim for industry recognitions like Great Place to Work and ISO 27001, and we measure ourselves against the standards Costco is famous for.",
  },

  // ----------------------------- ESG / CSR -----------------------------
  {
    id: 'esg',
    any: ['esg', 'csr', 'sustainability', 'sustainable', 'climate', 'environment', 'community', 'social', 'governance', 'carbon', 'green', 'emissions', 'net-zero', 'netzero'],
    phrases: ['climate action', 'climate goals', 'science based targets', 'net zero'],
    reply:
      "Costco committed to net-zero greenhouse-gas emissions across the value chain by 2050, with SBTi-approved interim targets: a 39% absolute reduction in Scope 1 + 2 by 2030 (vs 2020) and 20% intensity reduction in selected Scope 3 categories. The company also targets 100% renewable electricity by 2035.",
    followups: ['Tell me about culture', 'How do I report an ethics concern?'],
  },

  // ----------------------------- Ethics / Whistleblower -----------------------------
  {
    id: 'whistleblower',
    any: ['whistleblower', 'complaint', 'grievance', 'misconduct', 'harassment', 'retaliation', 'fraud', 'bribery'],
    phrases: ['report a concern', 'report concern'],
    reply:
      "Concerns can be raised confidentially. See the Whistleblower page in the footer for available channels, including anonymous reporting. Costco does not tolerate retaliation against good-faith reporters.",
    followups: ['What is the Code of Ethics?'],
  },

  // ----------------------------- Privacy / Cookies -----------------------------
  {
    id: 'privacy',
    any: ['privacy', 'gdpr', 'dpdp', 'data', 'protection', 'pii', 'personal'],
    phrases: ['data protection', 'privacy policy', 'gdpr', 'dpdp act'],
    reply:
      "We follow Costco's global privacy principles and are aware of GDPR and India's DPDP Act, 2023. See the Privacy notice and Cookies pages in the footer for details. This site uses only essential cookies by default.",
    followups: ['How do I change cookie settings?'],
  },
  {
    id: 'cookies',
    any: ['cookie', 'cookies', 'tracker', 'tracking', 'consent'],
    reply:
      "We use only strictly necessary cookies by default. With your consent we may also use Preferences, Analytics, and Marketing cookies — toggle these any time via the shield icon at the bottom-left, or 'Preferences' in the consent banner.",
  },

  // ----------------------------- Theme / site features -----------------------------
  {
    id: 'theme',
    any: ['theme', 'palette', 'colour', 'color', 'dark', 'light', 'mode'],
    phrases: ['dark mode', 'light mode', 'change theme', 'change colour', 'change color'],
    reply:
      "Tap the palette icon in the navbar to switch between Costco, Sunset, Forest, Ocean, and Mono palettes — and Light / Dark / System mode. Choices are saved on your device.",
  },
  {
    id: 'a11y',
    any: ['accessibility', 'a11y', 'screen reader', 'wcag', 'keyboard'],
    phrases: ['screen reader', 'accessibility statement'],
    reply:
      "We target WCAG 2.2 AA: skip-to-main, visible focus, semantic landmarks, reduced-motion support, labelled forms, and keyboard-friendly navigation. See the Accessibility statement in the footer for details and feedback.",
  },

  // ----------------------------- Contact / Press / Vendor -----------------------------
  {
    id: 'contact',
    any: ['contact', 'email', 'phone', 'reach', 'talk', 'in touch', 'connect'],
    phrases: ['get in touch', 'how do i contact'],
    reply:
      "Use the Contact section on this page — pick a topic (General, Partnership, Press, Careers, Vendor) and send us a message. Submitting opens your email client; nothing is sent from this page.",
  },
  {
    id: 'press-media',
    any: ['press', 'media', 'journalist', 'reporter'],
    phrases: ['press release', 'media inquiry'],
    reply: "For press and media, use the Contact form and select 'Press' as the topic.",
  },
  {
    id: 'vendor',
    any: ['vendor', 'supplier', 'partnership', 'partner', 'procure', 'rfp', 'rfq'],
    reply:
      "For vendor, supplier, or partnership inquiries, use the Contact form and select 'Vendor / Supplier' or 'Partnership'. Costco's supplier diligence aligns with our global Code of Ethics.",
  },

  // ----------------------------- Misc -----------------------------
  {
    id: 'thanks',
    any: ['thanks', 'thank', 'thx', 'appreciate', 'cheers', 'awesome', 'great'],
    reply: "You're welcome! Anything else I can help with?",
  },
  {
    id: 'bye',
    patterns: [/^(bye|goodbye|see you|cya|catch you)/i],
    reply: 'Goodbye! Come back any time — and best of luck if you apply on Talent500.',
  },
  {
    id: 'help',
    patterns: [/^help$/i, /im stuck|i'm stuck|not sure|confused/i],
    reply:
      "Try: 'Where are you located?', 'How do I apply?', 'Who is the CEO?', 'Tell me about Costco', 'What is Kirkland Signature?', 'Tell me about life at Costco'.",
  },
];

export const fallback = {
  reply:
    "I'm a generic on-page assistant and may not know that specifically. Try asking about Costco facts, the India GCC, our Hyderabad office, capabilities, careers, life at Costco, ESG, ethics, or contact info.",
  followups: ['Tell me about Costco', 'Who is the CEO?', 'Where are you located?', 'How do I apply for jobs?'],
};

// ---------------- Matcher ----------------

const STOP = new Set(['the','a','an','of','to','in','on','for','and','or','is','are','was','were','i','you','we','it','do','does','did','tell','me','about','have','has','can','will','would','should','what','where','when','who','how','why','please']);

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'@./-]+/gu, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

function score(input: string, intent: Intent) {
  const toks = tokens(input);
  let s = 0;

  // Token overlap with `any` keywords
  if (intent.any?.length) {
    const set = new Set(intent.any.map((x) => x.toLowerCase()));
    for (const t of toks) {
      if (set.has(t)) s += 3;
      else {
        // Loose substring match (catches plurals, simple inflections)
        for (const k of set) {
          if (k.length > 3 && (t.includes(k) || k.includes(t))) { s += 1.5; break; }
        }
      }
    }
  }

  // Phrase boosts
  if (intent.phrases?.length) {
    const lower = input.toLowerCase();
    for (const p of intent.phrases) if (lower.includes(p.toLowerCase())) s += 4;
  }

  // Regex patterns are strong signals
  if (intent.patterns?.length) {
    for (const re of intent.patterns) if (re.test(input)) s += 5;
  }

  return s;
}

export function answer(input: string): { reply: string; followups?: string[]; intentId?: string } {
  const text = (input || '').trim();
  if (!text) return { reply: 'Type a question and press Enter — try "Who is the CEO?"' };

  let best: { intent: Intent | null; s: number } = { intent: null, s: 0 };
  for (const it of intents) {
    const s = score(text, it);
    if (s > best.s) best = { intent: it, s };
  }

  // Threshold below which we treat as unmatched.
  if (best.intent && best.s >= 3) {
    return { reply: best.intent.reply, followups: best.intent.followups, intentId: best.intent.id };
  }
  return fallback;
}
