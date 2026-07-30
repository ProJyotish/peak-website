import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Quote } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import logo from "@/assets/peak-logo.png";
import { useEffect, useState } from "react";
import { resolveSourceGreeting, buildWhatsAppPrefillUrl, FALLBACK_GREETING_WORD } from "@/lib/sourceGreeting";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function useSourceGreeting() {
  const [greeting, setGreeting] = useState<string>(FALLBACK_GREETING_WORD);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    const sourceGreeting = resolveSourceGreeting({
      referrer: document.referrer,
      search: window.location.search,
    });
    setGreeting(sourceGreeting.word);
    
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919560057789";
    const url = buildWhatsAppPrefillUrl(phoneNumber, sourceGreeting.word);
    setWhatsappUrl(url);
  }, []);

  return { greeting, whatsappUrl: whatsappUrl || `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919560057789"}?text=${FALLBACK_GREETING_WORD}` };
}

function Nav() {
  const { whatsappUrl } = useSourceGreeting();
  
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-peak flex items-center justify-between py-6">
        <Wordmark />
        <nav className="flex items-center gap-8">
          <a href="#ask" className="hidden md:inline text-sm text-clay hover:text-ink transition-colors">Ask about</a>
          <a href="#how" className="hidden md:inline text-sm text-clay hover:text-ink transition-colors">How it works</a>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
          >
            Start Free Trial
          </a>
        </nav>
      </div>
    </header>
  );
}

function PeakMark() {
  // Stylized line-drawn peak: ascending, three converging lines
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden>
      <motion.path
        d="M 10 180 L 110 110 L 170 145 L 230 60 L 310 130"
        fill="none"
        stroke="hsl(var(--ink))"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
      />
      <motion.path
        d="M 230 60 L 230 195"
        stroke="hsl(var(--gold))"
        strokeWidth="0.6"
        strokeDasharray="2 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      />
      <motion.circle
        cx="230" cy="60" r="3"
        fill="hsl(var(--gold))"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.7 }}
      />
      <motion.text
        x="238" y="56"
        className="font-mono"
        fontSize="9"
        fill="hsl(var(--clay))"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        peak window
      </motion.text>
    </svg>
  );
}

function Hero() {
  const { whatsappUrl } = useSourceGreeting();
  
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container-peak max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <img
            src={logo}
            alt="Peak Logo"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto"
          />
        </motion.div>
        
        <motion.h1
          {...fade}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] text-ink mb-6"
        >
          Astrology made <span className="text-gold">practical</span>
        </motion.h1>
        
        <motion.p
          {...fade}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl leading-relaxed text-clay max-w-3xl mx-auto"
        >
          Your Vedic astrologer on WhatsApp. Get clarity on why a situation is unfolding, and a concrete path ahead toward your peak potential. Health, wealth, relationships, finance. Real questions, useful answers.
        </motion.p>

        <motion.div {...fade} transition={{ duration: 0.8, delay: 0.3 }} className="mt-10 flex flex-col items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-ink text-parchment font-mono text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_-12px_hsl(24_15%_9%_/_0.5)] hover:bg-gold hover:text-ink transition-all duration-300 hover:-translate-y-1"
          >
            <MessageCircle className="w-5 h-5" />
            Start on WhatsApp · Free
          </a>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-clay">
            First 10 questions free · No credit card · Instant answers
          </p>
          <p className="mt-3 text-sm text-clay/80 max-w-md mx-auto">
            Bank-grade security and confidentiality for what matters most.
          </p>
        </motion.div>

        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center text-clay">
            <span className="text-sm">Chart-personal</span>
            <span className="text-border">•</span>
            <span className="text-sm">Built for real decisions</span>
            <span className="text-border">•</span>
            <span className="text-sm">Available 24/7</span>
          </div>
          <p className="mt-4 text-xs text-clay/60 italic">
            Android & iOS apps coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SignalStrip() {
  const items = ["Health · Wealth · Relationship · Finance", "Reason + path ahead", "Astrology made practical"];
  return (
    <section className="border-y border-border bg-parchment-deep/60">
      <div className="container-peak grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {items.map((it, i) => (
          <motion.div
            key={it}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="py-6 px-4 text-center font-mono text-xs md:text-sm uppercase tracking-[0.22em] text-ink"
          >
            {it}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* --- Phone mockups --- */

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative">
      <div className="mx-auto w-[260px] h-[540px] rounded-[38px] bg-ink p-2 shadow-[0_30px_60px_-30px_hsl(24_15%_9%_/_0.4)]">
        <div className="relative h-full w-full rounded-[32px] bg-parchment overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink rounded-b-2xl z-10" />
          <div className="h-full w-full pt-8 pb-4 px-4 flex flex-col">{children}</div>
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-clay">{label}</p>
    </div>
  );
}

function PhoneToday() {
  const hours = Array.from({ length: 14 }, (_, i) => 6 + i);
  return (
    <PhoneFrame label="Today's windows">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-clay">Sun · 03 May</p>
      <h3 className="font-display text-lg leading-tight mt-1 text-ink">Today</h3>
      <div className="mt-4 flex-1 flex flex-col gap-3">
        <div className="border-l-2 border-gold pl-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">Optimal · 10:42 – 12:18</p>
          <p className="text-[11px] text-ink mt-0.5 leading-snug">Initiate the proposal. Mercury supports negotiation.</p>
        </div>
        <div className="border-l-2 border-clay/40 pl-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-clay">Optimal · 16:05 – 17:30</p>
          <p className="text-[11px] text-ink mt-0.5 leading-snug">Deep work. Long-form writing.</p>
        </div>
        <div className="border-l-2 border-destructive/60 pl-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-destructive">Avoid · 14:10 – 15:00</p>
          <p className="text-[11px] text-ink mt-0.5 leading-snug">Don't sign. Rāhu in 6th aspecting Sun.</p>
        </div>
        <div className="mt-auto">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            {hours.map((h) => {
              const optimal = (h >= 10 && h < 13) || (h >= 16 && h < 18);
              const avoid = h === 14;
              const cls = avoid ? "bg-destructive/70" : optimal ? "bg-gold" : "bg-clay/20";
              return <div key={h} className={`flex-1 ${cls}`} />;
            })}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[8px] text-clay">
            <span>06</span><span>12</span><span>18</span><span>22</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function PhoneGoals() {
  const goals = [
    { title: "Close Series A", progress: 68, next: "10:42" },
    { title: "Daily 6km run", progress: 41, next: "06:15" },
    { title: "Ship v2", progress: 22, next: "Tomorrow 09:00" },
  ];
  return (
    <PhoneFrame label="Goals">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-clay">3 active</p>
      <h3 className="font-display text-lg leading-tight mt-1 text-ink">Goals</h3>
      <div className="mt-4 flex-1 flex flex-col gap-3">
        {goals.map((g) => (
          <div key={g.title} className="border-b border-border pb-3">
            <div className="flex justify-between items-baseline">
              <p className="text-[12px] font-medium text-ink">{g.title}</p>
              <span className="font-mono text-[9px] text-clay">{g.progress}%</span>
            </div>
            <div className="mt-2 h-0.5 w-full bg-secondary">
              <div className="h-full bg-gold" style={{ width: `${g.progress}%` }} />
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-gold">Next aligned action · {g.next}</p>
          </div>
        ))}
      </div>
      <button className="mt-2 w-full border border-ink/20 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink rounded-sm">
        + Suggest from chat
      </button>
    </PhoneFrame>
  );
}

function PhonePatterns() {
  const points = [30, 45, 38, 62, 78, 70, 55, 48, 65, 82, 90, 72, 58, 50];
  const max = 100;
  const w = 220, h = 110;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`).join(" ");
  return (
    <PhoneFrame label="Patterns">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-clay">Cycle · 14 weeks</p>
      <h3 className="font-display text-lg leading-tight mt-1 text-ink">Patterns</h3>
      <div className="mt-6">
        <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full">
          <path d={path} fill="none" stroke="hsl(var(--ink))" strokeWidth="1" />
          <circle cx={10 * step} cy={h - (90 / max) * h} r="3" fill="hsl(var(--gold))" />
          <line x1={10 * step} y1="0" x2={10 * step} y2={h} stroke="hsl(var(--gold))" strokeWidth="0.4" strokeDasharray="2 3" />
          <text x={10 * step + 4} y="10" fontSize="7" fill="hsl(var(--gold))" className="font-mono">peak · wk 11</text>
        </svg>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-baseline justify-between border-t border-border pt-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-clay">Theme</p>
          <p className="text-[11px] text-ink">Career visibility</p>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-clay">Trough</p>
          <p className="text-[11px] text-ink">Wk 4 · low energy</p>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-clay">Peak</p>
          <p className="text-[11px] text-gold">Wk 11 · launch window</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function PhoneAdvisor() {
  return (
    <PhoneFrame label="Advisor">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-clay">Advisor · grounded in your chart</p>
      <h3 className="font-display text-lg leading-tight mt-1 text-ink">Conversation</h3>
      <div className="mt-4 flex-1 flex flex-col gap-2.5 text-[11px] leading-snug">
        <div className="self-end max-w-[80%] bg-ink text-parchment px-3 py-2 rounded-lg rounded-br-sm">
          Should I push for the raise this month?
        </div>
        <div className="self-start max-w-[85%] bg-secondary text-ink px-3 py-2 rounded-lg rounded-bl-sm">
          Yes  -  but wait until the 14th. Jupiter transits your 10th. Frame around impact, not tenure.
        </div>
        <div className="self-end max-w-[80%] bg-ink text-parchment px-3 py-2 rounded-lg rounded-br-sm">
          Fair. Anything else I should be holding?
        </div>
        <div className="self-start max-w-[90%] bg-secondary text-ink px-3 py-2 rounded-lg rounded-bl-sm">
          <p>Based on this month's chats, I'd suggest a goal:</p>
          <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold">Goal · Build a public portfolio by Aug</p>
        </div>
      </div>
      <div className="mt-3 border-t border-border pt-3 flex items-center gap-2">
        <div className="flex-1 h-7 rounded-full bg-secondary px-3 flex items-center font-mono text-[9px] text-clay">Ask anything…</div>
      </div>
    </PhoneFrame>
  );
}

function FeatureBlock({
  index,
  eyebrow,
  title,
  body,
  phone,
  reverse,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  phone: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.div
      {...fade}
      className={`grid md:grid-cols-12 gap-12 md:gap-16 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div className="md:col-span-6">
        <p className="eyebrow mb-4">{index} · {eyebrow}</p>
        <h3 className="font-display text-3xl md:text-4xl leading-tight text-ink">{title}</h3>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-6 h-px w-16 bg-gold" />
      </div>
      <div className="md:col-span-6 flex justify-center">{phone}</div>
    </motion.div>
  );
}

function PrivacyNote() {
  return (
    <section id="privacy" className="py-16 md:py-20 border-t border-border bg-parchment-deep/30">
      <div className="container-peak max-w-2xl">
        <motion.div {...fade}>
          <p className="eyebrow mb-3">Also worth knowing</p>
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
            Private and confidential
          </h2>
          <p className="mt-4 text-base leading-relaxed text-clay">
            Peak uses bank-grade security and confidentiality for the things that matter most to you. Your chart, your questions, and your guidance stay protected so you can ask clearly and move with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

type TopicId = "health" | "wealth" | "relationship" | "finance";

const TOPICS: {
  id: TopicId;
  label: string;
  blurb: string;
  questions: { who: string; q: string }[];
}[] = [
  {
    id: "health",
    label: "Health",
    blurb: "Energy, recovery, fertility, aging, and when to push or pause.",
    questions: [
      { who: "28 · early career", q: "I crash every afternoon. Is this a short transit or something I should treat seriously?" },
      { who: "34 · new mother", q: "When is my body likely to feel strong enough again for real training?" },
      { who: "Caregiver · parent 67", q: "Dad has a surgery decision next month. What does timing look like for recovery?" },
      { who: "Relocating adult", q: "Anxiety spiked after I changed cities. Is my chart showing a window I should plan around?" },
      { who: "45 · marathon training", q: "Which months favor stamina, and which raise injury risk?" },
      { who: "Couple trying to conceive", q: "What windows look supportive for health and fertility this year?" },
    ],
  },
  {
    id: "wealth",
    label: "Wealth",
    blurb: "Career moves, visibility, offers, and growth toward what you want to build.",
    questions: [
      { who: "24 · first job choice", q: "Stable PSU role or a startup offer. Which path fits my chart better right now?" },
      { who: "Woman founder · seed", q: "When should I pitch investors this quarter?" },
      { who: "40 · mid-management", q: "Am I favored for a leadership move, or should I deepen expertise instead?" },
      { who: "Pre-retiree", q: "I retire in two years. How do I sequence consulting versus a full exit?" },
      { who: "Side hustle paying", q: "When can I quit my job without overreaching?" },
      { who: "Return after career break", q: "Which months favor interviews and offers?" },
    ],
  },
  {
    id: "relationship",
    label: "Relationship",
    blurb: "Partnership, family, hard conversations, and timing that supports connection.",
    questions: [
      { who: "Young couple · 1 year", q: "Is this a good window to move in together?" },
      { who: "31 · dating apps fatigue", q: "When does my chart open for meeting someone serious?" },
      { who: "Parents of young kids", q: "Our marriage feels distant. When do honest talks land better than waiting?" },
      { who: "Considering divorce", q: "What does the next six months ask of me before I decide?" },
      { who: "Long-distance partners", q: "Which travel windows support us instead of straining us?" },
      { who: "Parent of a teen", q: "How do I time hard talks with my daughter so they actually land?" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    blurb: "Debt, savings, property, uneven income, and money decisions with real stakes.",
    questions: [
      { who: "27 · credit-card debt", q: "When should I aggressively pay down versus invest?" },
      { who: "New homeowners", q: "Is refinancing favored in the next year?" },
      { who: "Freelancer · uneven income", q: "Which months look better for big invoices and savings?" },
      { who: "NRI · dual currency", q: "When should we move savings or buy property?" },
      { who: "35 · starting SIPs", q: "Does my chart support a long accumulation phase now?" },
      { who: "Sandwich generation", q: "How do I balance supporting my parents with my own goals this year?" },
    ],
  },
];

function AskAbout() {
  const [active, setActive] = useState<TopicId>("health");
  const topic = TOPICS.find((p) => p.id === active) ?? TOPICS[0];
  const { whatsappUrl } = useSourceGreeting();

  return (
    <section id="ask" className="py-28 md:py-36 bg-parchment-deep/40 border-b border-border">
      <div className="container-peak">
        <motion.div {...fade} className="max-w-3xl mb-12 md:mb-16">
          <p className="eyebrow mb-4">What people ask</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight text-ink">
            Practical astrology for every kind of life issue
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-clay">
            Health. Wealth. Relationship. Finance. See the kinds of questions people actually ask. Different ages, genders, money situations, and ambitions. Then ask your own.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10">
          {TOPICS.map((p) => {
            const on = p.id === active;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 border transition-colors ${
                  on
                    ? "bg-ink text-parchment border-ink"
                    : "bg-transparent text-ink border-ink/20 hover:border-gold hover:text-gold"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border border-border bg-parchment"
        >
          <div className="px-6 py-5 md:px-8 border-b border-border">
            <h3 className="font-display text-2xl md:text-3xl text-ink">{topic.label}</h3>
            <p className="mt-2 text-base text-clay">{topic.blurb}</p>
          </div>
          <ul className="divide-y divide-border">
            {topic.questions.map((item) => (
              <li key={item.q} className="px-6 py-5 md:px-8 md:py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold mb-2">
                  {item.who}
                </p>
                <p className="text-base md:text-lg leading-snug text-ink">
                  &ldquo;{item.q}&rdquo;
                </p>
              </li>
            ))}
          </ul>
          <div className="px-6 py-5 md:px-8 border-t border-border bg-parchment-deep/50">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
            >
              Ask your version on WhatsApp
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ClarityPath() {
  return (
    <section id="clarity" className="py-28 md:py-36">
      <div className="container-peak">
        <motion.div {...fade} className="max-w-3xl mb-14">
          <p className="eyebrow mb-4">Why it happened · What to do next</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight text-ink">
            Clarity on the reason. A path toward your peak.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-clay">
            Peak is not fortune-cookie astrology. You get a grounded read on why a situation is showing up in your chart now, and what to do with the windows ahead so you can move toward your peak potential.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {[
            {
              title: "The reason",
              body: "See which periods, transits, and chart patterns are active. Understand the pressure or opening you are in, not just a yes or no.",
            },
            {
              title: "The path ahead",
              body: "Leave with timing, trade-offs, and a next step you can take. Aimed at progress in health, wealth, love, and money, not vague hope.",
            },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              {...fade}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-background px-6 py-10 md:px-10 md:py-14"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
                0{i + 1}
              </p>
              <h3 className="font-display text-2xl md:text-3xl text-ink">{col.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-clay">{col.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function What() {
  return (
    <section id="how" className="py-28 md:py-40 border-t border-border">
      <div className="container-peak">
        <motion.div {...fade} className="max-w-3xl mx-auto text-center mb-20">
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight text-ink">
            Vedic astrology, <span className="text-gold">made usable</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-clay">
            Chat with your AI astrologer on WhatsApp. Ask about health, wealth, relationships, finance, and timing. Instant answers grounded in your birth chart, aimed at decisions you can act on.
          </p>
        </motion.div>

        <div className="space-y-24">
          <motion.div {...fade} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-4">01 · Simple Start</p>
              <h3 className="font-display text-3xl md:text-4xl leading-tight text-ink">
                Just send your birth details
              </h3>
              <p className="mt-5 text-base leading-relaxed text-clay">
                Date, time, and place. That's all we need. Your complete birth chart is generated instantly, and every answer is customized to your planetary positions.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-[500px] rounded-3xl bg-parchment border-4 border-ink shadow-2xl overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#075E54] text-white p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Peak Astrology</p>
                    <p className="text-xs opacity-80">Online</p>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="bg-[#ECE5DD] p-3 h-full overflow-hidden">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-2 max-w-[80%]">
                        <p>Hi! I want to know my chart</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-bl-sm p-2 max-w-[85%]">
                        <p>Welcome! 🙏 I'll generate your personalized birth chart.</p>
                        <p className="mt-2">Please share:</p>
                        <p>1. Date of birth</p>
                        <p>2. Time of birth</p>
                        <p>3. Place of birth</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-2 max-w-[80%]">
                        <p>15 March 1990</p>
                        <p>7:30 AM</p>
                        <p>Mumbai, India</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-bl-sm p-2 max-w-[85%]">
                        <p>✓ Chart generated!</p>
                        <p className="mt-2">Ask me anything about your career, relationships, health, or timing for important decisions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fade} className="grid md:grid-cols-2 gap-12 items-center md:[&>*:first-child]:order-2">
            <div>
              <p className="eyebrow mb-4">02 · Ask Anything</p>
              <h3 className="font-display text-3xl md:text-4xl leading-tight text-ink">
                Real questions, instant answers
              </h3>
              <p className="mt-5 text-base leading-relaxed text-clay">
                "Should I take this job?" "When's the best time to travel?" "Is this relationship compatible?" Get clear, actionable guidance - not vague predictions.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-[500px] rounded-3xl bg-parchment border-4 border-ink shadow-2xl overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#075E54] text-white p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Peak Astrology</p>
                    <p className="text-xs opacity-80">Online</p>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="bg-[#ECE5DD] p-3 h-full overflow-hidden">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-2 max-w-[80%]">
                        <p>Should I switch jobs this month?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-bl-sm p-2 max-w-[85%]">
                        <p>Based on your chart:</p>
                        <p className="mt-2">✓ Jupiter in 10th house - favorable for career change</p>
                        <p className="mt-1">⚠ Mercury retrograde until 22nd - wait for contracts</p>
                        <p className="mt-2 font-semibold text-gold">Best timing: Last week of this month</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-2 max-w-[80%]">
                        <p>Thanks! What about my relationship?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-bl-sm p-2 max-w-[85%]">
                        <p>Venus in 7th house shows strong partnership energy...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fade} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-4">03 · No Fluff</p>
              <h3 className="font-display text-3xl md:text-4xl leading-tight text-ink">
                Trained on real cases
              </h3>
              <p className="mt-5 text-base leading-relaxed text-clay">
                Our AI is trained on thousands of actual readings. No generic horoscopes. Every answer considers your chart, current planetary periods (dashas), and transits.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-[500px] rounded-3xl bg-parchment border-4 border-ink shadow-2xl overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#075E54] text-white p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Peak Astrology</p>
                    <p className="text-xs opacity-80">Online</p>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="bg-[#ECE5DD] p-3 h-full overflow-hidden">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-2 max-w-[80%]">
                        <p>When should I start my business?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-bl-sm p-2 max-w-[85%]">
                        <p>Your 10th lord is strong. Current dasha:</p>
                        <p className="mt-2">• Moon-Jupiter period (favorable)</p>
                        <p>• Rahu transit in 2nd (finances)</p>
                        <p className="mt-2 font-semibold">Muhurta: March 15, 10:30-11:45 AM</p>
                        <p className="mt-2 text-gold">This combines your personal strength with auspicious timing.</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-2 max-w-[80%]">
                        <p>Wow, that's specific! 🙏</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FounderProfile({
  name,
  bio,
  detail,
  tags,
  href,
  linkLabel,
  delay = 0,
}: {
  name: string;
  bio: string;
  detail: string;
  tags: string[];
  href: string;
  linkLabel: string;
  delay?: number;
}) {
  return (
    <motion.article
      {...fade}
      transition={{ duration: 0.8, delay }}
      className="flex h-full flex-col rounded-sm border border-border bg-parchment p-6 sm:p-7 md:p-8 shadow-[0_16px_48px_-32px_hsl(24_15%_9%_/_0.28)]"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="h-px w-10 bg-gold shrink-0" aria-hidden />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">Co-founder</p>
      </div>
      <h3 className="font-display text-2xl sm:text-[1.65rem] md:text-3xl leading-tight text-gold">{name}</h3>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground flex-1">
        <p>{bio}</p>
        <p>{detail}</p>
      </div>
      <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
        {tags.map((c) => (
          <span key={c} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink border border-ink/20 px-3 py-1.5 rounded-full bg-parchment-deep/40">
            {c}
          </span>
        ))}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 md:mt-8 inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
      >
        {linkLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </motion.article>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "It told me that I will have a medical procedure. And I had one the very next week! Freaky!",
      name: "",
      location: "",
    },
    {
      quote: "My billionaire boss used to set her crucial meeting time astrologically. Now I do it too.",
      name: "",
      location: "",
    },
    {
      quote: "It told me about my break-up last year. Also told me how to avoid a repeat. Very useful inputs",
      name: "",
      location: "",
    },
  ];

  return (
    <section className="py-24 bg-parchment-deep/30">
      <div className="container-peak">
        <motion.div {...fade} className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">
            What people say
          </h2>
          <p className="text-lg text-clay max-w-2xl mx-auto">
            Real experiences from real people
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-parchment rounded-2xl p-6 shadow-md border border-border relative flex flex-col"
            >
              <Quote className="w-8 h-8 text-gold/30 absolute top-4 right-4" />
              <p className="text-ink leading-relaxed italic flex-1 mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm font-semibold text-gold/40">★</span>
                </div>
                <div>
                  <p className="text-xs text-clay italic">
                    Verified user
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section id="founder" className="py-28 md:py-36 bg-parchment-deep/50 border-y border-border">
      <div className="container-peak">
        <motion.div {...fade} className="mb-12 md:mb-16 lg:mb-20">
          <p className="eyebrow mb-4">The founders</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">
            First principles meet modern life.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Peak is co-built by IIT Delhi batchmates  -  a practicing jyotishi and a AI technology leader  -  bringing scriptural depth and large-scale engineering to the same product.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
          <FounderProfile
            name="Abhimanyu Singh Rana"
            bio="An IIT Delhi graduate and practicing jyotishi who has run businesses, built SaaS products, raised venture capital, and worked on the Prime Minister's team."
            detail="His edge is the rare overlap: scriptural jyotisha studied as a science, applied through years of consulting clients across the world on professional and personal decisions. That operator's lens is why Peak is goal-oriented  -  not predictive theatre."
            tags={["IIT Delhi", "Practicing jyotishi", "Global clientele", "Operator background"]}
            href="https://www.pinpointjyotish.com/my-jyotisha-journey"
            linkLabel="Read his journey into jyotisha"
          />
          <FounderProfile
            name="Nishant Kyal"
            bio="An IIT Delhi graduate who has led technology at Amazon and Freecharge, co-founded startups, and built LLM solutions for a leading Indian law firm."
            detail="Two decades of shipping large-scale products  -  the same rigor behind legal research for hundreds of lawyers, now applied to making jyotisha practical, personal, and trustworthy at scale. He is also a certified yoga teacher."
            tags={["IIT Delhi", "Amazon & Freecharge", "LLM for legal", "Startup experience", "Certified yoga teacher"]}
            href="https://www.linkedin.com/in/nishant-kyal"
            linkLabel="View on LinkedIn"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const rows = [
    ["Predictions", "Windows of action"],
    ["Vague timing", "The exact hour"],
    ["Daily horoscope for a sign", "Today, for your chart"],
    ["Belief", "Signal"],
  ];
  return (
    <section className="py-28 md:py-36">
      <div className="container-peak">
        <motion.div {...fade} className="max-w-2xl mb-16">
          <p className="eyebrow mb-4">The manifesto</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">
            We took out the mysticism.<br />
            <span className="text-clay">What's left is the part that works.</span>
          </h2>
        </motion.div>
        <motion.div {...fade} className="border border-border rounded-sm overflow-hidden">
          <div className="grid grid-cols-2 bg-parchment-deep/60 border-b border-border">
            <div className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-clay border-r border-border">Traditional astrology</div>
            <div className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Peak</div>
          </div>
          {rows.map(([a, b], i) => (
            <div key={a} className={`grid grid-cols-2 ${i !== rows.length - 1 ? "border-b border-border" : ""}`}>
              <div className="px-6 py-5 text-clay border-r border-border line-through decoration-clay/40">{a}</div>
              <div className="px-6 py-5 font-display text-lg text-ink">{b}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Origin() {
  return (
    <section className="py-28 md:py-32 border-t border-border bg-parchment-deep/40">
      <div className="container-peak max-w-3xl">
        <motion.p {...fade} className="eyebrow mb-6">Origin</motion.p>
        <motion.p {...fade} transition={{ duration: 0.8, delay: 0.05 }} className="font-display text-2xl md:text-3xl leading-snug text-ink">
          Built from India, for the world. Jyotisha is one of the oldest systems for understanding time and human patterns. We're making it useful for people who live by calendars, not rituals.
        </motion.p>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { whatsappUrl } = useSourceGreeting();
  
  return (
    <section className="py-32 md:py-40">
      <div className="container-peak max-w-3xl text-center">
        <motion.p {...fade} className="eyebrow mb-6">Try it free</motion.p>
        <motion.h2 {...fade} transition={{ duration: 0.8, delay: 0.05 }} className="font-display text-4xl md:text-6xl leading-[1.05] text-ink">
          Start asking questions on <span className="text-gold">WhatsApp</span>
        </motion.h2>
        <motion.p {...fade} transition={{ duration: 0.8, delay: 0.1 }} className="mt-6 text-lg text-clay max-w-2xl mx-auto">
          Your first 10 questions are free. No credit card. Real guidance on why things are unfolding and what to do next.
        </motion.p>
        <motion.div {...fade} transition={{ duration: 0.8, delay: 0.15 }} className="mt-12 flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-ink text-parchment font-mono text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_-12px_hsl(24_15%_9%_/_0.5)] hover:bg-gold hover:text-ink transition-all duration-300 hover:-translate-y-1"
          >
            <MessageCircle className="w-5 h-5" />
            Start Free on WhatsApp
          </a>
        </motion.div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-clay">10 questions free · No signup · Instant answers</p>
      </div>
    </section>
  );
}

function FloatingWhatsAppCta() {
  const { whatsappUrl } = useSourceGreeting();
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-gold text-ink font-medium rounded-full shadow-lg hover:bg-gold/90 transition-colors md:hidden"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm">Try Free</span>
    </a>
  );
}

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <SignalStrip />
      <AskAbout />
      <ClarityPath />
      <What />
      <PrivacyNote />
      <Testimonials />
      <Founder />
      <Manifesto />
      <Origin />
      <FinalCTA />
      <SiteFooter />
      <FloatingWhatsAppCta />
    </main>
  );
};

export default Index;
