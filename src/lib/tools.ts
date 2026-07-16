import type { LucideIcon } from "lucide-react";
import { Globe } from "lucide-react";

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  welcome: string;
  icon: LucideIcon;
  focusAreas: string[];
  aboutTitle?: string;
  aboutSections?: { title: string; body: string }[];
  faqs: ToolFaq[];
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "astrocartography",
    title: "Astrocartography Map",
    shortTitle: "Astrocartography",
    tagline: "Where your chart favors place, travel, and relocation",
    description:
      "See how planetary lines cross the globe from your birth chart - Sun for vitality, Venus for ease, Jupiter for growth, Saturn for structure - so you can choose cities with intention.",
    welcome:
      "Ask where to travel or live - compare cities, states, countries, or continents, then explore the map and line meanings if you want depth.",
    icon: Globe,
    focusAreas: ["Planetary lines", "Relocation themes", "Travel timing", "City fit"],
    aboutTitle: "How astrocartography works",
    aboutSections: [
      {
        title: "Planetary lines",
        body: "Each planet casts angular lines across the Earth from your birth moment. Living or traveling near a line amplifies that planet's themes - opportunity, love, ambition, or challenge.",
      },
      {
        title: "Reading the map",
        body: "Jupiter and Venus lines often feel expansive and harmonious; Saturn and Mars can demand effort. Peak will highlight supportive corridors and places to approach with care.",
      },
      {
        title: "Relocation vs travel",
        body: "Short visits activate a place temporarily; relocation reshapes how your chart expresses day to day. Use the map as a guide, not a guarantee.",
      },
    ],
    faqs: [
      {
        question: "What is astrocartography?",
        answer:
          "It maps where planetary energies from your birth chart are strongest on Earth - helping you choose cities for work, love, study, or healing.",
      },
      {
        question: "Do I need an exact birth time?",
        answer:
          "Yes. Line placement depends on the precise moment of birth. Even a 15-minute error can shift lines by hundreds of kilometers.",
      },
      {
        question: "Is living on a line required?",
        answer:
          "No. Being within a few hundred kilometers can still color experience. Crossing a line while traveling can also bring a short, intense activation.",
      },
      {
        question: "Can Peak pick the perfect city for me?",
        answer:
          "Charts show tendencies. Lifestyle, visa, career, and personal preference still matter - use the map as one informed input among many.",
      },
    ],
  },
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
