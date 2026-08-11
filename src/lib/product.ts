import { ROUTES } from "@/lib/routes";
import { productSeoKeywords } from "@/lib/seo";

export type ProductPoint = {
  title: string;
  body: string;
};

export type ProductScreenshotSlide = {
  label: string;
  caption?: string;
  /** Path under /public, e.g. `/product/today-home.png`. */
  src?: string;
};

export type ProductSeo = {
  /** Full document title (include brand). */
  title: string;
  description: string;
  keywords: string[];
};

export type ProductPage = {
  slug: string;
  eyebrow: string;
  title: string;
  /** One-line pitch under the title */
  tagline: string;
  /** Longer intro for the page body */
  description: string;
  /** Short card blurb on the /product index */
  summary: string;
  seo: ProductSeo;
  screenshots: ProductScreenshotSlide[];
  howItWorks: ProductPoint[];
  sellingPoints: ProductPoint[];
};

export const PRODUCT_PAGES: ProductPage[] = [
  {
    slug: "daily-guidance",
    eyebrow: "Today",
    title: "Your day, decoded",
    tagline: "Personalized daily guidance from your birth chart. Clear, useful, and ready when you open the app.",
    description:
      "Each morning Peak shows you yesterday, today, and tomorrow in one place. A live moon arc with tithi and nakṣatra sets the sky, and your chart turns that sky into guidance you can actually use.",
    summary: "A three-day personalized reading with lucky colour, focus houses, and shareable day cards.",
    seo: {
      title: "Daily Horoscope & Personalized Guidance | Peak",
      description:
        "Personalized daily horoscope from your kundali and rashi chart. Hour by hour Vedic guidance, not a generic sun-sign read.",
      keywords: productSeoKeywords(
        "daily personalized horoscope",
        "today horoscope",
        "kundali daily reading",
        "rashi today",
      ),
    },
    screenshots: [
      {
        label: "Today, daily guidance",
        caption: "Night sky header and the day distilled",
        src: "/product/today-home.png",
      },
      {
        label: "Flow with, hold back",
        caption: "What to lean into and the hora timeline",
        src: "/product/hora-timeline.png",
      },
    ],
    howItWorks: [
      {
        title: "The day, distilled",
        body: "One clear reading written from your chart, not a generic horoscope. Easy to skim in seconds or share as a story card.",
      },
      {
        title: "Flow with, hold back",
        body: "Paired guidance for what to lean into and what to pause, plus the colour that supports you today.",
      },
      {
        title: "Focus areas",
        body: "See which houses are active and where the day wants your attention: career, relationships, health, or wealth.",
      },
    ],
    sellingPoints: [
      {
        title: "Built on your kundli",
        body: "Every line is personal. Peak reads your birth chart, not a sun-sign column.",
      },
      {
        title: "Yesterday, today, tomorrow",
        body: "Three days of context so you can plan ahead and make sense of what just passed.",
      },
      {
        title: "Share without oversharing",
        body: "Story-format cards with moon phase, reading, and lucky colour. Branded for Peak, private by design.",
      },
      {
        title: "Practical, not fluff",
        body: "Guidance aimed at real decisions: when to push, when to wait, what to wear, what to watch.",
      },
    ],
  },
  {
    slug: "hora-timing",
    eyebrow: "Muhurta",
    title: "Hour by hour windows",
    tagline: "Classical hora as a modern timeline. Favourable, mixed, and caution windows for today.",
    description:
      "Peak maps planetary hours onto your day so you know when to start something, when to focus, and when to hold back. The live “now” card shows the ruling planet, mood, and time remaining. Open the full-day sheet for every hora with Good for and Avoid tips.",
    summary: "A live hora card, progress bar, and full-day timeline of auspicious and caution windows.",
    seo: {
      title: "Hora Timing & Muhurta from Your Kundali | Peak",
      description:
        "Find auspicious hours with personalized hora timing from your birth chart. Classical muhurta for real decisions, grounded in your kundali and rashi.",
      keywords: productSeoKeywords(
        "muhurta",
        "hora timing",
        "auspicious time today",
        "kundali muhurat",
        "rashi muhurta",
      ),
    },
    screenshots: [
      {
        label: "Hora guidance now",
        caption: "Live planet, mood, and countdown",
        src: "/product/today-home.png",
      },
      {
        label: "Hora timeline",
        caption: "Hour by hour windows with Good for and Avoid",
        src: "/product/hora-timeline.png",
      },
    ],
    howItWorks: [
      {
        title: "Hora guidance now",
        body: "See the planet ruling this hour, whether the mood is favourable or caution, and a live countdown to the next shift.",
      },
      {
        title: "Full-day timeline",
        body: "Scroll every planetary hour with expandable tips: Good for, Avoid, and a short why.",
      },
      {
        title: "Anchored to sunrise",
        body: "Windows follow classical hora from sunrise to sunset, so timing matches your location and sky.",
      },
    ],
    sellingPoints: [
      {
        title: "Muhurta without the jargon wall",
        body: "Ancient timing logic, presented like a calendar you already know how to use.",
      },
      {
        title: "Act in the right window",
        body: "Schedule calls, launches, and deep work when the hour supports you, not when it works against you.",
      },
      {
        title: "Live, not static",
        body: "The “now” state updates as the day moves, so Peak stays useful at 9am and at 4pm.",
      },
      {
        title: "A clear answer to “is this a good time?”",
        body: "One place to check before you move. No waiting for a human astrologer to reply.",
      },
    ],
  },
  {
    slug: "ask",
    eyebrow: "Ask",
    title: "Ask anything",
    tagline: "Private, chart-grounded conversations. Understand why something is unfolding, and what to do next.",
    description:
      "Ask is your private consultation desk. Start from suggested questions tuned to your chart, or type freely. Conversations stay threaded with follow-ups, history, and clear usage. Peak answers from your kundli on career, relationships, health, wealth, and timing.",
    summary: "AI Vedic consultations with suggested questions, threaded chat, and chart-aware answers.",
    seo: {
      title: "Personalized Astrology Chat from Your Kundali | Peak",
      description:
        "Chat with Peak about career, relationships, health, and wealth. Answers grounded in your kundali, rashi, and birth chart.",
      keywords: productSeoKeywords(
        "astrology chat",
        "kundali chat",
        "ask astrologer online",
        "personalized astrology chat",
        "AI kundali consultation",
      ),
    },
    screenshots: [
      {
        label: "Conversation thread",
        caption: "Chart-grounded chat with follow-ups",
        src: "/product/ask-conversation.png",
      },
      {
        label: "Switch profile",
        caption: "Choose whose chart Ask should use",
        src: "/product/profiles-switch.png",
      },
    ],
    howItWorks: [
      {
        title: "What’s on your mind?",
        body: "Start from suggested questions generated for you, or type freely. Peak meets you where you are.",
      },
      {
        title: "Threaded, private chat",
        body: "Follow-ups stay in context. Pin, rename, or revisit past conversations whenever you need them.",
      },
      {
        title: "Transparent usage",
        body: "See messages used on your plan right in the composer, with a clear path to unlock more when you’re ready.",
      },
    ],
    sellingPoints: [
      {
        title: "Answers from your chart",
        body: "Not generic advice. Responses are grounded in your birth chart and the question you actually asked.",
      },
      {
        title: "Reason and a path ahead",
        body: "Understand why a situation is unfolding, then get a concrete direction you can act on.",
      },
      {
        title: "Private and discreet",
        body: "Conversations are read by no one. Bank-grade practices keep your chart and questions yours.",
      },
      {
        title: "Available when you are",
        body: "Ask at midnight or between meetings. No appointment, no waiting list.",
      },
    ],
  },
  {
    slug: "goals",
    eyebrow: "Goals",
    title: "Reach what you’re aiming for",
    tagline: "Set goals across life areas, then see the road ahead in daśā timing windows.",
    description:
      "Goals in Peak aren’t a to-do list. You name what you’re reaching toward, where you are now, what help you need, and what’s stopping you. Peak then shows favourable, neutral, and unfavourable timing windows, with guidance for each stretch and a way back into Ask.",
    summary: "Goal tracking with chart-suggested starts and a daśā “road ahead” forecast.",
    seo: {
      title: "Goals & Kundali Timing Forecast | Peak",
      description:
        "Set personalized goals and see timing from your kundali and rashi chart. Long-term Vedic forecast with guidance you can chat about.",
      keywords: productSeoKeywords(
        "kundali goals",
        "dasha forecast",
        "personalized astrology goals",
        "birth chart timing",
        "rashi forecast",
      ),
    },
    screenshots: [
      {
        label: "Goals list",
        caption: "What you’re reaching toward",
        src: "/product/goals-list.png",
      },
      {
        label: "Create a goal",
        caption: "Coaching-style prompts",
        src: "/product/goals-add.png",
      },
      {
        label: "The road ahead",
        caption: "Daśā timing windows and what to expect",
        src: "/product/goals-timing.png",
      },
    ],
    howItWorks: [
      {
        title: "Create with coaching prompts",
        body: "Name, current status, what you need help with, and what’s stopping you. Guidance fits the real obstacle.",
      },
      {
        title: "Suggested from your chart",
        body: "When you’re not sure where to begin, empty-state cards propose goals from your placements.",
      },
      {
        title: "The road ahead",
        body: "A ribbon of mahādaśā and antardaśā windows marked favourable, neutral, or unfavourable, with a “you are here” marker and expandable guidance.",
      },
      {
        title: "Discuss the timing",
        body: "Jump into Ask with the goal and window already filled in when you want a deeper conversation.",
      },
    ],
    sellingPoints: [
      {
        title: "Plan for the long term",
        body: "Forecast how things unfold for the goals and moments that matter most, not just today’s mood.",
      },
      {
        title: "Timing you can schedule around",
        body: "Know when to push hard and when to consolidate, before you burn energy in the wrong season.",
      },
      {
        title: "Career, health, finance, and more",
        body: "Categories match how you already think about life, with timeframes from this month to beyond a year.",
      },
      {
        title: "Guidance that stays with the goal",
        body: "Every window explains what to expect and what to do, then links back into Ask.",
      },
    ],
  },
  {
    slug: "family-profiles",
    eyebrow: "Profiles",
    title: "People you care about",
    tagline: "Add family and loved ones, each with their own chart, goals, and conversations.",
    description:
      "Peak isn’t only for you. Create profiles for the people you care about, switch the active chart when you Ask, and keep insights personal to each person. Profile limits follow your plan, with a clear upgrade path when you need more.",
    summary: "Multiple birth profiles under one account. Switch charts for Ask, goals, and daily guidance.",
    seo: {
      title: "Family Kundali & Personalized Charts | Peak",
      description:
        "Add family profiles with their own kundali, rashi chart, daily horoscope, and astrology chat. Personalized guidance for people you care about.",
      keywords: productSeoKeywords(
        "family kundali",
        "multiple birth charts",
        "personalized family horoscope",
        "rashi for family",
        "kundli matching family",
      ),
    },
    screenshots: [
      {
        label: "Profiles list",
        caption: "People you care about",
        src: "/product/profiles-list.png",
      },
      {
        label: "Add a profile",
        caption: "Birth details form",
        src: "/product/profiles-add.png",
      },
      {
        label: "Switch profile",
        caption: "Active chart in Ask",
        src: "/product/profiles-switch.png",
      },
    ],
    howItWorks: [
      {
        title: "Add a person",
        body: "Name, date, time, and place of birth. Peak builds their chart with the same care as yours.",
      },
      {
        title: "Switch when you Ask",
        body: "Change the active profile so answers and goals stay attached to the right person.",
      },
      {
        title: "One subscription, more lives",
        body: "Keep partner, parents, or children on the same plan without mixing charts or chats.",
      },
    ],
    sellingPoints: [
      {
        title: "Family clarity, privately",
        body: "Help the people you love without sharing their details outside Peak.",
      },
      {
        title: "No chart mix-ups",
        body: "Each profile owns its guidance history, so you never confuse your timing with theirs.",
      },
      {
        title: "Built for care, not gossip",
        body: "Use Peak to support family decisions on career moves, health seasons, and relationship timing.",
      },
      {
        title: "Grows with your plan",
        body: "Start with what you need. Unlock more profiles when your circle grows.",
      },
    ],
  },
  {
    slug: "how-it-works",
    eyebrow: "Setup",
    title: "From birth details to clarity",
    tagline: "A short, careful setup. Then Peak is tuned to the life areas you care about most.",
    description:
      "Share birth details freely. Deeper context leads to deeper insight. Peak uses date, time, and place (city search or current location), then lets you tune focus areas like Career, Health, Finance, Social, and Learning. Turn on notifications for life-phase shifts, auspicious windows, and when your daily report is ready.",
    summary: "Onboarding, birth details, insight tuning, and notifications that keep you in rhythm.",
    seo: {
      title: "How Peak Builds Your Personalized Kundali | Peak",
      description:
        "Share birth details to generate your kundali and rashi chart, tune personalized insights, and get daily horoscope plus astrology chat when you need it.",
      keywords: productSeoKeywords(
        "create kundali online",
        "birth details for kundli",
        "personalized rashi setup",
        "how daily horoscope works",
        "vedic astrology app setup",
      ),
    },
    screenshots: [
      {
        label: "Birth details",
        caption: "Date, time, place",
        src: "/product/profiles-add.png",
      },
    ],
    howItWorks: [
      {
        title: "Birth details",
        body: "Name, date, time, and place, accurate to your city, with optional current location for place of birth lookup.",
      },
      {
        title: "Tune your insights",
        body: "Choose the life areas Peak should prioritise so daily guidance and Ask stay relevant.",
      },
      {
        title: "Stay notified",
        body: "Get alerts when life phases change, auspicious windows open, and your daily report is ready.",
      },
    ],
    sellingPoints: [
      {
        title: "Accurate and personal",
        body: "Personalized astrology built with deep Vedic training, not a one-size sun-sign feed.",
      },
      {
        title: "Affordable and practical",
        body: "Clarity on career, relationships, health, and wealth. Guidance you can use.",
      },
      {
        title: "Private from day one",
        body: "Your chart and questions stay protected with bank-grade security practices.",
      },
      {
        title: "Minutes to start",
        body: "Phone login, birth details, tune insights. Then Today and Ask are ready.",
      },
    ],
  },
];

export function getProductBySlug(slug: string): ProductPage | undefined {
  return PRODUCT_PAGES.find((p) => p.slug === slug);
}

export function productPath(slug: string): string {
  return ROUTES.productPage(slug);
}
