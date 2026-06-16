import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import peakLogo from "@/assets/peak-logo.svg";

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number");

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Wordmark() {
  return (
    <a href="#" className="flex items-center gap-2.5 group">
      <img src={peakLogo} alt="" className="h-8 w-8 rounded-sm" />
      <span className="font-display text-xl tracking-tight">Peak</span>
    </a>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-peak flex items-center justify-between py-6">
        <Wordmark />
        <nav className="flex items-center gap-8">
          <a href="#what" className="hidden md:inline text-sm text-clay hover:text-ink transition-colors">What it does</a>
          <a href="#waitlist" className="font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors">
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}

function WaitlistForm({ source = "landing", size = "lg", variant = "default" }: { source?: string; size?: "lg" | "sm"; variant?: "default" | "solid" }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({ phone: parsed.data, source });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        setDone(true);
        toast.success("You're already on the list.");
        return;
      }
      toast.error("Could not request access. Please try again.");
      return;
    }
    setDone(true);
    toast.success("You're on the list. We'll be in touch.");
  };

  if (done) {
    return (
      <div className={`flex items-center gap-3 ${size === "lg" ? "py-4" : "py-2"}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-4 w-4" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink">Request received</p>
      </div>
    );
  }

  if (variant === "solid") {
    return (
      <form onSubmit={submit} className="flex w-full max-w-md flex-col sm:flex-row items-stretch gap-3">
        <input
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className={`flex-1 rounded-sm border border-ink/20 bg-parchment px-4 outline-none placeholder:text-clay/60 text-ink focus:border-gold transition-colors ${size === "lg" ? "py-4 text-base" : "py-3 text-sm"}`}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`group inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 font-mono text-xs uppercase tracking-[0.2em] text-parchment shadow-[0_10px_30px_-12px_hsl(24_15%_9%_/_0.5)] hover:bg-gold hover:text-ink disabled:opacity-50 transition-colors ${size === "lg" ? "py-4" : "py-3"}`}
        >
          {loading ? "Sending" : "Request access"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className={`flex w-full max-w-md items-stretch border-b ${loading ? "border-gold" : "border-ink/40"} focus-within:border-gold transition-colors`}>
      <input
        type="tel"
        required
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91 98765 43210"
        className={`flex-1 bg-transparent outline-none placeholder:text-clay/60 text-ink ${size === "lg" ? "py-4 text-base" : "py-3 text-sm"}`}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="ml-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink hover:text-gold disabled:opacity-50 transition-colors"
      >
        {loading ? "Sending" : "Request access"}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
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
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container-peak grid gap-16 md:grid-cols-12 items-center">
        <div className="md:col-span-7">
          <motion.p {...fade} className="eyebrow mb-6">Jyotisha, made practical</motion.p>
          <motion.h1
            {...fade}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl leading-[1.02] text-ink"
          >
            Realise your <em className="not-italic text-gold">Peak</em> Potential.
          </motion.h1>
          <motion.p
            {...fade}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Hour-by-hour guidance. Long-term pattern mapping. Goal-bound coaching, grounded in astrological timing — not mysticism. For people who live by calendars.
          </motion.p>
          <motion.div {...fade} transition={{ duration: 0.8, delay: 0.25 }} className="mt-10" id="waitlist">
            <WaitlistForm source="hero" variant="solid" />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-clay">Early access · iOS &amp; Android · Coming soon</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="md:col-span-5"
        >
          <div className="border-l border-gold/40 pl-6">
            <PeakMark />
            <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              <span>06:00</span>
              <span className="text-center">today</span>
              <span className="text-right">22:00</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SignalStrip() {
  const items = ["Hour-by-hour", "Pattern-aware", "Goal-bound"];
  return (
    <section className="border-y border-border bg-parchment-deep/60">
      <div className="container-peak grid grid-cols-3 divide-x divide-border">
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
          Yes — but wait until the 14th. Jupiter transits your 10th. Frame around impact, not tenure.
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

function What() {
  return (
    <section id="what" className="py-28 md:py-40">
      <div className="container-peak">
        <motion.div {...fade} className="max-w-2xl mb-20">
          <p className="eyebrow mb-4">What Peak does</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">
            Clear signal, on time.<br />
            <span className="text-clay">From your chart to your calendar.</span>
          </h2>
        </motion.div>

        <div className="space-y-32">
          <FeatureBlock
            index="01"
            eyebrow="Today's windows"
            title="The right hour, not the right zodiac."
            body="Each morning, Peak reads your chart against today's transits and returns the exact windows to act — and the ones to avoid. No symbols to interpret. Just a window, a reason, and a time."
            phone={<PhoneToday />}
          />
          <FeatureBlock
            index="02"
            eyebrow="Goals"
            title="Goals that move with the sky."
            body="Set what matters, or let the AI advisor surface goals from your conversations. Peak then maps the calendar — the right week to push, the right hour to pitch — until the goal is met."
            phone={<PhoneGoals />}
            reverse
          />
          <FeatureBlock
            index="03"
            eyebrow="Patterns"
            title="See the cycle before it sees you."
            body="Long-term mapping of the dasha and transits shaping the next 6, 18, and 60 months. Recurring themes, peaks, and troughs — laid against the calendar you already use."
            phone={<PhonePatterns />}
          />
          <FeatureBlock
            index="04"
            eyebrow="Advisor"
            title="An advisor that has read your chart."
            body="Chat with an AI grounded in your jyotisha — not a generic chatbot. It remembers what you're working on, suggests goals from your patterns, and answers in plain English."
            phone={<PhoneAdvisor />}
            reverse
          />
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
            Peak is co-built by IIT Delhi batchmates — a practicing jyotishi and a production AI engineer — bringing scriptural depth and large-scale engineering to the same product.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
          <FounderProfile
            name="Abhimanyu Singh Rana"
            bio="An IIT Delhi graduate and practicing jyotishi who has run businesses, built SaaS products, raised venture capital, and worked on the Prime Minister's team."
            detail="His edge is the rare overlap: scriptural jyotisha studied as a science, applied through years of consulting clients across the world on professional and personal decisions. That operator's lens is why Peak is goal-oriented — not predictive theatre."
            tags={["IIT Delhi", "Practicing jyotishi", "Global clientele", "Operator background"]}
            href="https://www.pinpointjyotish.com/my-jyotisha-journey"
            linkLabel="Read his journey into jyotisha"
          />
          <FounderProfile
            name="Nishant Kyal"
            bio="An IIT Delhi graduate who has led technology at Amazon and Freecharge, co-founded startups, and built LLM solutions for a leading Indian law firm."
            detail="Two decades of shipping large-scale products — the same rigor behind legal research for hundreds of lawyers, now applied to making jyotisha practical, personal, and trustworthy at scale. He is also a certified yoga teacher."
            tags={["IIT Delhi", "Amazon & Freecharge", "LLM for legal", "Startup experience", "Certified yoga teacher"]}
            href="https://linkedin.com/in/nishant-kyal"
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
    ["Rituals required", "No rituals required"],
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
  return (
    <section className="py-32 md:py-40">
      <div className="container-peak max-w-3xl text-center">
        <motion.p {...fade} className="eyebrow mb-6">Early access</motion.p>
        <motion.h2 {...fade} transition={{ duration: 0.8, delay: 0.05 }} className="font-display text-4xl md:text-6xl leading-[1.05] text-ink">
          Find your <em className="not-italic text-gold">peak</em>.<br />Live by it.
        </motion.h2>
        <motion.div {...fade} transition={{ duration: 0.8, delay: 0.15 }} className="mt-12 flex justify-center">
          <WaitlistForm source="footer" variant="solid" />
        </motion.div>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-clay">Built in India · For the world</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-peak flex flex-col md:flex-row items-center justify-between gap-4">
        <Wordmark />
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">© Peak {new Date().getFullYear()} · All rights reserved</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">Built and maintained by <strong className="text-ink">Aryaman Knowledge Services Private Limited</strong></p>
        </div>
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
          <a href="mailto:contact@peaklife.me" className="hover:text-ink transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <SignalStrip />
      <What />
      <Founder />
      <Manifesto />
      <Origin />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
