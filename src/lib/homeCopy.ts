import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/** Homepage copy, ported verbatim from the `redesign` branch's static build.
 *  Text lives here rather than in the markup so the FAQ can feed both the
 *  rendered accordion and the FAQPage JSON-LD from one source. */

type Emphasis = { before: string; em: string; after: string };

export const HOME = {
  seo: {
    title: "Peak — No two lives come with the same user manual.",
    description:
      "Peak is an AI astrology app that helps you understand your life, with expert Jyotisha personalized to your chart, your location, your questions and your goals.",
    ogDescription:
      "An AI astrology app grounded in Jyotisha. Hour-by-hour timing, answers that remember your chart, and goals with the periods that support them.",
    ogImage: "/assets/img/og.png",
  },

  nav: {
    links: [
      { href: "#today", label: "Today" },
      { href: "#ask", label: "Ask" },
      { href: "#goals", label: "Goals" },
      { href: "#how", label: "How it works" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { label: "try the app free", href: SITE.stores.android },
  },

  hero: {
    title: "No two lives come with the same user manual.",
    lede: "Peak is an AI astrology app that helps you understand yours, with expert astrology, personalized for your everyday life.",
    ctas: [
      { label: "get the android app", href: SITE.stores.android, tone: "primary" as const },
      { label: "open peak in your browser", href: SITE.app, tone: "on-ink" as const },
    ],
    trust: ["Instant answers", "No credit card required", "Private by default"],
  },

  band: ["Work", "Relationships", "Health", "Money", "Timing", "The next move"],

  statement: {
    title: "Find out what is meant for you, and what isn't.",
    body: "Don't waste your life working harder to achieve something that won't truly fulfil you.",
  },

  features: [
    {
      id: "today",
      eyebrow: "Today",
      title: "Start each day with clarity and confidence.",
      lede: {
        before: "Peak's ",
        em: "Today",
        after:
          " guides you through every hour of the day, so you can consistently improve your life.",
      } satisfies Emphasis,
      body: "Plan work, conversations and important tasks around timing calculated for your chart and current location.",
      cta: { label: "try the app", href: "#get" },
      flip: false,
      /** The Today capture is taller than its frame and eases through on scroll. */
      parallax: true,
      screen: {
        src: "/assets/img/screen-today.jpg",
        alt: "The Peak Today screen: the day distilled, the current Mars hora marked favorable, the hora timeline, and flow-with and hold-back guidance.",
        label: "Today, scrolled",
      },
    },
    {
      id: "ask",
      eyebrow: "Ask",
      title: "Get real answers to the questions that matter most.",
      lede: {
        before: "Peak's ",
        em: "Ask",
        after:
          " gets you instant answers to whatever is on your mind, whether it's when to invest, whom to trust, or what to do next.",
      } satisfies Emphasis,
      body: "Get instant answers that remember your chart, earlier conversations and the goals you care about.",
      cta: { label: "try the app", href: "#get" },
      flip: true,
      parallax: false,
      screen: {
        src: "/assets/img/screen-ask.jpg",
        alt: "The Peak Ask screen, showing the kinds of questions people bring: when to hold a business meeting, when to schedule a health appointment, when to propose.",
        label: "Ask",
      },
    },
    {
      id: "goals",
      eyebrow: "Goals",
      title: "Turn the future you want into your next move.",
      lede: {
        before: "Peak's ",
        em: "Goals",
        after:
          " helps you move closer, every day, to what your heart truly desires, be it a better career, relationship, or lifestyle.",
      } satisfies Emphasis,
      body: "Add any short or long term goal. See the periods that support it, where patience may help and what to do next.",
      cta: { label: "try the app", href: "#get" },
      flip: false,
      parallax: false,
      screen: {
        src: "/assets/img/screen-goals.jpg",
        alt: "A Peak goal opened: save for my dream vacation, with its dasha periods, a road-ahead timeline and guidance for the current window.",
        label: "Goals",
      },
    },
  ],

  personalization: {
    eyebrow: "Astrology that's truly personalized",
    title: "How Peak personalizes every interaction with you.",
    left: [
      {
        title: "Your chart",
        body: "Peak uses your unique birth details to customize every conversation.",
      },
      {
        title: "Your location",
        body: "Peak adjusts daily timing to where you are, so it's never a generic forecast.",
      },
    ],
    right: [
      {
        title: "Your questions",
        body: "Peak remembers earlier conversations, so you don't have to repeat yourself.",
      },
      {
        title: "Your goals",
        body: "Peak keeps your long term goals in mind, so guidance is never short sighted.",
      },
    ],
  },

  how: {
    eyebrow: "How it works",
    title: "Make Peak work for you in three simple steps.",
    steps: [
      {
        num: "01",
        title: "Tell Peak when and where you were born.",
        body: "Peak creates your birth chart to personalize every interaction you have.",
        screen: {
          src: "/assets/img/screen-profile.jpg",
          alt: "The Add Profile screen: name, date, time and place of birth.",
        },
      },
      {
        num: "02",
        title: "Tell Peak what matters most to you.",
        body: "Ask a question, add a goal or simply see what each hour in the day holds for you.",
        screen: {
          src: "/assets/img/screen-ask.jpg",
          alt: "The Ask screen with suggested questions.",
        },
      },
      {
        num: "03",
        title: "Let Peak help you decide your next move.",
        body: "Plan your day, track your life goals and keep asking as your plans evolve.",
        screen: {
          src: "/assets/img/screen-today.jpg",
          alt: "The Today screen with the day's hora timeline.",
        },
      },
    ],
  },

  founders: {
    eyebrow: "The founders",
    title: "Meet the experts behind Peak.",
    people: [
      {
        name: "Abhimanyu Singh Rana",
        role: "Co-founder, PeakLife & practising astrologer",
        portrait: { src: "/assets/img/founder-abhimanyu.jpg", alt: "Abhimanyu Singh Rana" },
        paragraphs: [
          "Peak's astrology is shaped by Abhimanyu Singh Rana, an IIT Delhi graduate and practising Jyotishi trained in a rigorous astrological lineage. His own journey as a leader in technology, business and politics taught him that working hard doesn't help if you're working on the wrong thing.",
          "After years of helping thousands find purpose and take back control of their lives, Abhimanyu helped build Peak so that his expertise could be available every day, not only during a consultation.",
          "His method informs how Peak reads a chart, connects different signals and turns them into personalized guidance.",
        ],
        // Destination still to be decided — placeholder in the approved design too.
        link: { label: "read his jyotisha journey →", href: "#" },
      },
      {
        name: "Nishant Kyal",
        role: "Co-founder, PeakLife & technology leader",
        portrait: { src: "/assets/img/founder-nishant.jpg", alt: "Nishant Kyal" },
        paragraphs: [
          "An IIT Delhi graduate who has led technology at Amazon and Freecharge, co-founded startups, and built LLM solutions for a leading Indian law firm.",
          "Two decades of shipping large-scale products, the same rigor behind legal research for hundreds of lawyers, now applied to making jyotisha practical, personal, and trustworthy at scale.",
        ],
        // Destination still to be decided — placeholder in the approved design too.
        link: { label: "view his linkedin →", href: "#" },
      },
    ],
  },

  method: {
    eyebrow: "The method",
    title: "Expert astrology, made instantly available through AI.",
    lead: "Jyotisha is an ancient Indian system of astrology that explains how and when unfolding karma impacts life. Peak allows you to access the power of practicing Jyotishis through a truly personalized AI astrology app.",
    cards: [
      {
        title: "Peak is based on thousands of real readings.",
        body: "Peak follows the Jyotisha method shaped by our founder's training, lineage and experience as a Jyotishi.",
      },
      {
        title: "Peak offers astrological answers, not AI guesswork.",
        body: "Every answer is checked against your chart, so our AI's astrology stays consistent with your actual details.",
      },
      {
        title: "Peak is here to help you decide, not decide for you.",
        body: "Each answer helps you think and act on an hour-to-hour basis, so you can make progress on your goals.",
      },
      {
        title: "Your chart and your questions stay private.",
        body: "Privacy is a promise and zero judgement is a guarantee with Peak.",
      },
    ],
    link: { label: "learn how Peak works →", href: "#how" },
  },

  testimonials: {
    title: "Peak has helped thousands understand the user manual of their life.",
    quotes: [
      {
        quote:
          "Used Peak during a very low phase and it helped bring structure to my life and achieve some major goals.",
        attribution: "Verified user",
      },
      {
        quote: "Peak helped me be patient in love and find my husband at the right time.",
        attribution: "Verified user",
      },
      {
        quote:
          "My billionaire boss used to set her crucial meeting time astrologically. Now I do it too with Peak.",
        attribution: "Verified user",
      },
    ],
  },

  whenToUse: {
    eyebrow: "When to use Peak",
    title: "You do not have to wait until everything falls apart.",
    body: "Use Peak when life is difficult. Use it when life is going well. Use it while planning a week, preparing for a conversation, building a habit or moving steadily towards a goal. Take control of your life with the power of astrology.",
  },

  pricing: {
    eyebrow: "Free to start",
    title: "Try Peak before you subscribe.",
    intro: "Use Peak for free and get",
    free: ["1 free birth chart", "10 free questions", "3 personalized daily reports"],
    price: {
      before: "And if you're enjoying Peak, subscribe from ",
      india: "₹499 a month",
      middle: " in India, or ",
      us: "$20 a month",
      after: " in the United States.",
    },
    stores: [
      {
        kind: "Android",
        label: "Get the app on Google Play",
        href: SITE.stores.android,
        logo: { src: "/assets/img/google-play-logo.png", alt: "Google Play" },
      },
      {
        kind: "iPhone and everything else",
        label: "Open Peak in your browser",
        href: SITE.app,
        logo: null,
      },
    ],
    note: "No download needed on iPhone. Peak runs at app.peaklife.me.",
  },

  faq: {
    title: "Frequently asked questions.",
    items: [
      {
        question: "What is Peak Life?",
        answer:
          "Peak is an AI astrology app built to make expert astrology personal, practical and useful in everyday life. It brings your birth chart, current timing, questions and goals together, so you can plan your day, understand what is changing and make your next move with more clarity.",
      },
      {
        question: "What does Peak mean by the “manual” to your life?",
        answer:
          "No two people have exactly the same strengths, limitations, patterns or timing. Peak uses astrology to help you understand yours. This understanding is not a set of instructions or a fixed prediction. It gives you more context about what you are working with; what you choose to do with it remains up to you.",
      },
      {
        question: "Is Peak an AI astrologer?",
        answer:
          "Yes. You can ask Peak questions and instantly receive astrologically accurate answers that are personalized to your chart. Peak is not a general AI chatbot, it's built as a custom engine trained by thousands of real readings conducted by PeakLife's founder and his team of astrologers.",
      },
      {
        question: "Does Peak use Vedic astrology or Western astrology?",
        answer:
          "Peak is grounded in Jyotisha, also known as Vedic astrology. It reads your complete birth chart, planetary periods and current transits, not only your sun sign. You do not need to know the terminology. Peak explains what matters in plain language and connects it to the life you are actually living.",
      },
      {
        question: "How is Peak different from a daily horoscope app?",
        answer:
          "A daily horoscope gives one message to everyone born under the same sign. Peak begins with you. Your chart, location, timing, goals and previous conversations can all change the answer. The result is daily guidance designed for one life, yours.",
      },
      {
        question: "Is Peak a birth-chart app?",
        answer:
          "Your birth chart is where Peak begins, not where it ends. Peak creates your chart and then helps you use it: to plan your day, ask questions, understand recurring patterns, set goals and ask questions that build on your earlier conversations.",
      },
      {
        question: "How does Peak personalize my astrology?",
        answer:
          "Peak brings together your birth chart, current location, planetary timing, questions, conversation history and goals. That context helps it understand not only what is happening astrologically, but what you are trying to do with it.",
      },
      {
        question: "What can I ask Peak?",
        answer:
          "Ask about the things that matter in real life: work, relationships, money, wellbeing, timing, habits and difficult decisions. You might ask when to have a conversation, how to approach a career move or why the same pattern keeps returning. Peak gives you context and a next step, not a command.",
      },
      {
        question: "Does Peak remember my previous questions and goals?",
        answer:
          "Yes. Peak can use your earlier conversations and the goals you have entered to make later guidance more relevant. You do not have to explain your life again every time you return. Your chart stays the same, but the conversation can keep moving with you.",
      },
      {
        question: "Does Peak tell me what to do?",
        answer:
          "No. Peak can show you the timing, the pattern, the trade-offs and the possibilities around a decision. It may also point out when your choices contradict a goal you have set. But the decision remains yours.",
      },
      {
        question: "What is a personalized daily report?",
        answer:
          "It is a daily reading created from your chart and current planetary timing, not a general forecast for your zodiac sign. It can show which parts of the day support action, where more care may be useful and what deserves your attention now.",
      },
      {
        question: "How was Peak's AI astrologer trained?",
        answer:
          "Peak is built on thousands of real astrology readings and the working knowledge of its astrologer-founder. That experience informs how Peak reads charts, connects different signals and turns them into relevant guidance.",
      },
      {
        question: "How reliable is Peak's astrology?",
        answer:
          "Peak is designed to give chart-specific answers through a consistent, founder-governed astrological method. It does not rely on generic sign descriptions or AI guesswork. Astrology can offer patterns, timing and perspective; it cannot guarantee an outcome or remove the role of your choices.",
      },
      {
        question: "Are human astrologers involved in Peak?",
        answer:
          "Yes. Human astrological judgment sits at the heart of the product. Peak's method, rules, interpretations and boundaries are shaped by its astrologer-founder and the lineage in which he trained. AI allows that knowledge to be available at scale; it does not replace the expertise behind it.",
      },
      {
        question: "Can Peak answer medical, legal or investment questions?",
        answer:
          "Peak can help you explore timing, pressure, patterns and personal priorities around serious decisions. It does not replace a doctor, lawyer or financial adviser, and it will not tell you to buy a particular stock, choose a medical treatment or take a specific legal action. Where professional expertise is needed, Peak will say so.",
      },
      {
        question: "What information do I need to create my chart?",
        answer:
          "You will need your date, time and place of birth, along with your current location. These details allow Peak to calculate the planetary positions and houses in your birth chart. The more accurate your birth information, the more precise the chart can be.",
      },
      {
        question: "Can I use Peak if I do not know my exact birth time?",
        answer:
          "Peak works best with an accurate birth time because it can change your rising sign, houses and timing. If you do not know it, some chart information may still be available, but the guidance may be less precise. Peak will not pretend that an uncertain chart offers the same level of detail.",
      },
      {
        question: "What can I use for free?",
        answer:
          "You can start with one free birth chart, ten free questions in Ask and three personalized daily reports. No credit card is required. You can subscribe whenever you want more access.",
      },
      {
        question: "How much does Peak cost?",
        answer:
          "Peak costs ₹499 a month in India and $20 a month in the United States. Some plans or in-app purchases may unlock additional charts or other features. You are paying for ongoing access, not by the question and not by the minute.",
      },
      {
        question: "Can I use Peak on my phone?",
        answer:
          "Peak has an Android app. On iPhone, and on any other device, Peak runs in your browser at app.peaklife.me with no download. Verify your mobile number and create your first chart to begin.",
      },
      {
        question: "Is my birth chart and conversation data private?",
        answer:
          "Yes. Your birth details, chart and conversations are private. Peak protects what you share, so you can ask honest questions without turning your personal life into public content.",
      },
    ],
  },

  footer: {
    lockup: {
      src: "/assets/img/peak-lockup-on-ink.png",
      alt: "PEAK. User manual for your life.",
    },
    links: [
      { label: "Product", to: ROUTES.product },
      { label: "Contact", to: ROUTES.contact },
      { label: "Privacy", to: ROUTES.privacy },
      { label: "Terms", to: ROUTES.terms },
    ],
    legal: [
      "© Peak 2026. All rights reserved.",
      `Built and maintained by ${SITE.legalName}.`,
    ],
  },
} as const;
