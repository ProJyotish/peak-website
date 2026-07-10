import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Star, Users, Quote, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/peak-logo.png";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  crown: Crown,
  users: Users,
  star: Star,
};

// The server appends a region digit to the user id in the payment link
// (0 = India, 1 = international), resolved from the account's phone so the
// client can't pick its own currency. Strip it before using the id anywhere.
const parseUserIdParam = (
  raw: string
): { userId: string; region: "india" | "international" } => {
  if (raw.includes("-")) {
    const parts = raw.split("-");
    if (parts.length >= 2) {
      const secondPart = parts[1];
      const suffix = secondPart.slice(0, 1);
      if (suffix === "0" || suffix === "1") {
        parts[1] = secondPart.slice(1);
        return {
          userId: parts.join("-"),
          region: suffix === "0" ? "india" : "international",
        };
      }
    }
  }

  const suffix = raw.slice(-1);
  if (suffix === "0" || suffix === "1") {
    return {
      userId: raw.slice(0, -1),
      region: suffix === "0" ? "india" : "international",
    };
  }
  return { userId: raw, region: "international" };
};

type RazorpayOptions = {
  key: string;
  name: string;
  description: string;
  subscription_id: string;
  prefill?: {
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler?: (response: unknown) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const loadRazorpayScript = async () => {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const parsePriceStringToMinorUnits = (price: string, currency: "INR" | "USD") => {
  // Example: "₹499" / "$19.99"
  const cleaned = price.replace(/,/g, "").replace(/[^\d.]/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value) || value <= 0) return 0;

  // Razorpay expects minor units (paisa/cents).
  return value;
};

const getLaunchReferencePrice = (displayPrice: string) => {
  const symbolMatch = displayPrice.match(/[^\d.,]/);
  const symbol = symbolMatch ? symbolMatch[0] : "";
  const cleaned = displayPrice.replace(/,/g, "").replace(/[^\d.]/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value) || value <= 0) return displayPrice;

  // Launch reference price = current price +30%.
  // INR prices are rounded to nearest 100 as requested.
  const bumped = value * 1.3;
  const rounded = symbol === "₹" ? Math.round(bumped / 100) * 100 : Math.round(bumped);
  return `${symbol}${rounded.toLocaleString("en-IN")}`;
};

// Pricing data (from ProJyotish)
const pricingData = {
  description: "Your astrology companion for everything in life - accurate guidance developed by IITians.",
  india: [
    {
      name: "Premium",
      iconType: "crown",
      popular: false,
      badge: "",
      monthlyPrice: "₹499",
      quarterlyPrice: "₹1,099",
      monthlyTotal: "₹499",
      quarterlyTotal: "₹1,099",
      effectiveMonthlyPrice: "₹366/mo",
      quarterlySavings: "Save 27%",
      features: [
        "Unlimited Questions",
        "Daily Favourable Time Reports",
        "Customised for Your Kundli",
        "Personalised for Your Life",
      ],
    },
    {
      name: "Power User",
      iconType: "users",
      popular: true,
      badge: "Most Popular",
      monthlyPrice: "₹599",
      quarterlyPrice: "₹1,339",
      monthlyTotal: "₹599",
      quarterlyTotal: "₹1,339",
      effectiveMonthlyPrice: "₹446/mo",
      quarterlySavings: "Save 25%",
      features: [
        "Everything in Premium",
        "Support for multiple profiles",
      ],
    },
  ],
  international: [
    {
      name: "Premium",
      iconType: "crown",
      popular: false,
      badge: "",
      monthlyPrice: "$19.99",
      quarterlyPrice: "$47.99",
      monthlyTotal: "$19.99",
      quarterlyTotal: "$47.99",
      effectiveMonthlyPrice: "$16/mo",
      quarterlySavings: "Save 20%",
      features: [
        "Unlimited Questions",
        "Daily Favourable Time Reports",
        "Customised for Your Kundli",
        "Personalised for Your Life",
      ],
    },
    {
      name: "Power User",
      iconType: "users",
      popular: true,
      badge: "Most Popular",
      monthlyPrice: "$24.99",
      quarterlyPrice: "$59.99",
      monthlyTotal: "$24.99",
      quarterlyTotal: "$59.99",
      effectiveMonthlyPrice: "$20/mo",
      quarterlySavings: "Save 20%",
      features: [
        "Everything in Premium",
        "Support for multiple profiles",
      ],
    },
  ],
};

const checkoutTestimonials = [
  {
    quote: "It told me that I will have a medical procedure. And I had one the very next week! Freaky!",
  },
  {
    quote: "My billionaire boss used to set her crucial meeting time astrologically. Now I do it too.",
  },
  {
    quote: "It told me about my break-up last year. Also told me how to avoid a repeat. Very useful inputs",
  },
];

const checkoutFaqs = [
  {
    question: "How can I upgrade to Power User if I am on Premium?",
    answer:
      "You can upgrade anytime. Your old subscription will be cancelled, and any unused balance will be refunded.",
  },
  {
    question: "How can I cancel?",
    answer:
      "You can cancel your subscription directly from your UPI app or through your credit card provider. Cancellations will be effective from the next billing date and subscription will stay active until the end of the current billing period. You can also contact us at support@peaklife.me for assistance.",
  },
  {
    question: "Refund policy",
    answer:
      "We do not offer refunds once payment is made. We provide a free trial of 10 questions and 3 days of personalized reports so you can evaluate our service before subscribing.",
  },
];

const Checkout = () => {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [searchParams] = useSearchParams();

  const rawUserId = searchParams.get("pid") ??
    searchParams.get("userid") ??
    searchParams.get("userId") ??
    "";

  const { userId, region } = useMemo(
    () => parseUserIdParam(rawUserId),
    [rawUserId]
  );

  // Identify user in PostHog when userid is present (region digit stripped).
  useEffect(() => {
    if (userId && window.posthog) {
      window.posthog.identify(userId);
    }
  }, [userId]);

  const plans = pricingData[region];
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const subscriptionApiUrl = import.meta.env.VITE_SUBSCRIPTION_API_URL;
  const currency: "INR" | "USD" = region === "india" ? "INR" : "USD";

  const handleRazorpayPayNow = async (plan: (typeof plans)[number]) => {
    if (!razorpayKey) {
      window.alert("Payment is temporarily unavailable. Razorpay key is missing.");
      return;
    }
    if (!subscriptionApiUrl) {
      window.alert("Payment is temporarily unavailable. Subscription API URL is missing.");
      return;
    }

    const billingTerm = isQuarterly ? "QUARTERLY" : "MONTHLY";
    const planNameKey = plan.name.replace(/\s+/g, "_").toUpperCase();
    const regionKey = region === "india" ? "INDIA" : "INTERNATIONAL";
    const price = isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice;

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      window.alert("Unable to load Razorpay checkout. Please try again.");
      return;
    }

    const billingTermLabel = isQuarterly ? "Quarterly" : "Monthly";
    const subscriptionRes = await fetch(subscriptionApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parsePriceStringToMinorUnits(price, currency),
        totalCount: 12,
        customerNotify: 1,
        userId: userId,
        metadata: {
          region: regionKey,
          plan: planNameKey,
          term: billingTerm,
          user_id: userId || undefined,
        },
      }),
    });

    if (!subscriptionRes.ok) {
      window.alert("Unable to create subscription. Please try again.");
      return;
    }

    const subscriptionData = (await subscriptionRes.json()) as {
      id?: string;
      subscriptionId?: string;
    };
    const subscriptionId = subscriptionData.id || subscriptionData.subscriptionId;
    if (!subscriptionId) {
      window.alert("Subscription ID was not returned by API.");
      return;
    }

    const payment = new window.Razorpay({
      key: razorpayKey,
      name: "PeakLife",
      description: `${plan.name} ${billingTermLabel} Subscription`,
      subscription_id: subscriptionId,
      prefill: userId ? { contact: userId } : undefined,
      theme: { color: "#F59E0B" },
      handler: () => {
        window.location.href = `/`;
      },
    });

    payment.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-bone to-clay/5">
      <div
        role="banner"
        className="w-full border-b border-gold/20 bg-gold/10 text-ink shadow-sm"
      >
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3">
          <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          <p className="font-mono text-center text-xs font-semibold uppercase tracking-wide sm:text-sm">
            Introductory launch pricing — limited time
          </p>
        </div>
      </div>
      <main>
        <section className="pt-10 pb-24 sm:pt-12">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="flex justify-center mb-3">
                <img
                  src={logo}
                  alt="Peak Logo"
                  className="w-20 h-20 md:w-28 md:h-28 mx-auto"
                />
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink mb-4">
                Checkout
              </h1>
              <p className="text-lg text-clay max-w-2xl mx-auto mb-6">
                {pricingData.description}
              </p>
            </motion.div>

            <div className="flex items-center justify-center gap-3 mb-10">
              <span
                className={`text-sm font-medium transition-colors ${
                  !isQuarterly ? "text-ink" : "text-clay"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsQuarterly(!isQuarterly)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isQuarterly ? "bg-gold" : "bg-clay/20"
                }`}
              >
                <span
                  className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform ${
                    isQuarterly ? "bg-ink translate-x-7" : "bg-gold translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors ${
                  isQuarterly ? "text-ink" : "text-clay"
                }`}
              >
                Quarterly
              </span>
              <span
                className={`w-20 text-center px-2 py-0.5 rounded-full text-xs font-semibold transition-opacity ${
                  isQuarterly ? "bg-gold/20 text-gold opacity-100" : "opacity-0"
                }`}
              >
                Best Value
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => {
                const price = isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice;
                const total = isQuarterly ? plan.quarterlyTotal : plan.monthlyTotal;
                const launchReferencePrice = getLaunchReferencePrice(price);
                const savings = isQuarterly ? plan.quarterlySavings : "";
                const Icon = iconMap[plan.iconType] || Crown;

                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative rounded-2xl p-8 flex flex-col h-full ${
                      plan.popular
                        ? "bg-gold text-ink shadow-lg"
                        : "bg-cream border-2 border-clay/20"
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-ink px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                        {plan.badge}
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div
                        className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                          plan.popular ? "bg-ink/10" : "bg-gold/10"
                        }`}
                      >
                        <Icon
                          className={`w-7 h-7 ${
                            plan.popular ? "text-ink" : "text-gold"
                          }`}
                        />
                      </div>

                      <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "" : "text-ink"}`}>
                        {plan.name}
                      </h3>

                      <div className="mt-4">
                        {isQuarterly ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-end justify-center gap-2">
                              <span
                                className={`text-4xl font-bold ${
                                  plan.popular ? "text-ink" : "text-gold"
                                }`}
                              >
                                {price}
                              </span>
                              <span
                                className={`text-4xl line-through ${
                                  plan.popular ? "text-ink/60" : "text-clay"
                                }`}
                              >
                                {launchReferencePrice}
                              </span>
                              <span
                                className={`ml-1 ${
                                  plan.popular ? "text-ink/80" : "text-clay"
                                }`}
                              >
                                /quarter
                              </span>
                            </div>
                            <span
                              className={`text-sm ${
                                plan.popular ? "text-ink/80" : "text-clay"
                              }`}
                            >
                              ({plan.effectiveMonthlyPrice})
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-end justify-center gap-2 whitespace-nowrap">
                            <span
                              className={`text-4xl font-bold ${
                                plan.popular ? "text-ink" : "text-gold"
                              }`}
                            >
                              {price}
                            </span>
                            <span
                              className={`text-4xl font-bold line-through ${
                                plan.popular ? "text-ink/60" : "text-clay"
                              }`}
                            >
                              {launchReferencePrice}
                            </span>
                            <span className={`${plan.popular ? "text-ink/80" : "text-clay"}`}>
                              /month
                            </span>
                          </div>
                        )}
                      </div>

                      {isQuarterly && savings && (
                        <span className="inline-block mt-2 bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-semibold">
                          {savings}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check
                            className={`w-5 h-5 shrink-0 mt-0.5 ${
                              plan.popular ? "text-ink" : "text-gold"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              plan.popular ? "text-ink/90" : "text-ink"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-ink text-gold hover:bg-ink/90"
                          : "bg-gold text-ink hover:bg-gold/90"
                      }`}
                      size="lg"
                      onClick={() => handleRazorpayPayNow(plan)}
                    >
                      Pay Now
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 max-w-3xl mx-auto"
            >
              <div className="rounded-2xl bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-2 border-gold/30 p-8 md:p-10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl" />
                
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center mb-4">
                    <GraduationCap className="w-9 h-9 text-gold" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3">
                    Built by IIT Delhi Alumni
                  </h3>
                  <p className="text-base md:text-lg text-clay leading-relaxed max-w-xl">
                    Co-founded by IIT Delhi batchmates - a practicing jyotishi and a production AI engineer - combining scriptural depth with modern engineering rigor.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <span className="font-mono text-xs uppercase tracking-wider text-ink/80 border border-gold/40 px-4 py-2 rounded-full bg-parchment/50">
                      IIT Delhi
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-ink/80 border border-gold/40 px-4 py-2 rounded-full bg-parchment/50">
                      Practicing Jyotishi
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-ink/80 border border-gold/40 px-4 py-2 rounded-full bg-parchment/50">
                      AI Engineer
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3">
                  Trusted by People Like You
                </h2>
                <p className="text-base text-clay">
                  Real experiences from verified users
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {checkoutTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="bg-cream rounded-xl p-6 shadow-md border border-clay/20 relative flex flex-col hover:shadow-lg transition-shadow"
                  >
                    <Quote className="w-7 h-7 text-gold/30 absolute top-4 right-4" />
                    <p className="text-sm md:text-base text-ink leading-relaxed italic flex-1 mb-5">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 border-t border-clay/20 pt-4">
                      <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-clay font-medium">
                          Verified user
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {checkoutFaqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-clay/20 bg-cream/80 p-5"
                  >
                    <h3 className="text-base md:text-lg font-semibold text-ink">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm md:text-base text-clay">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Checkout;
