import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  crown: Crown,
  users: Users,
  star: Star,
};

const normalizePhone = (phone: string) => phone.replace(/[^\d+]/g, "").slice(0, 12);

const isIndianPhoneNumber = (phone: string | null) => {
  if (!phone) return false;
  return normalizePhone(phone).replace(/\D/g, "").startsWith("91");
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

const parsePriceStringToMinorUnits = (price: string) => {
  const cleaned = price.replace(/,/g, "").replace(/[^\d.]/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value) || value <= 0) return 0;
  return value;
};

const getLaunchReferencePrice = (displayPrice: string) => {
  const symbolMatch = displayPrice.match(/[^\d.,]/);
  const symbol = symbolMatch ? symbolMatch[0] : "";
  const cleaned = displayPrice.replace(/,/g, "").replace(/[^\d.]/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value) || value <= 0) return displayPrice;

  const bumped = value * 1.3;
  const rounded = symbol === "₹" ? Math.round(bumped / 100) * 100 : Math.round(bumped);
  return `${symbol}${rounded.toLocaleString("en-IN")}`;
};

// Pricing data
const pricingData = {
  description: "Choose the plan that fits your wellness journey",
  india: [
    {
      name: "Essential",
      iconType: "users",
      popular: false,
      badge: "",
      monthlyPrice: "₹99",
      quarterlyPrice: "₹249",
      monthlyTotal: "₹99",
      quarterlyTotal: "₹249",
      effectiveMonthlyPrice: "₹83/mo",
      quarterlySavings: "Save ₹48",
      features: [
        "Basic wellness insights",
        "Daily health tips",
        "Community access",
        "Email support",
      ],
    },
    {
      name: "Premium",
      iconType: "crown",
      popular: true,
      badge: "Most Popular",
      monthlyPrice: "₹199",
      quarterlyPrice: "₹499",
      monthlyTotal: "₹199",
      quarterlyTotal: "₹499",
      effectiveMonthlyPrice: "₹166/mo",
      quarterlySavings: "Save ₹98",
      features: [
        "All Essential features",
        "Personalized wellness plans",
        "Priority support",
        "Advanced analytics",
        "Exclusive content",
      ],
    },
  ],
  international: [
    {
      name: "Essential",
      iconType: "users",
      popular: false,
      badge: "",
      monthlyPrice: "$5",
      quarterlyPrice: "$12",
      monthlyTotal: "$5",
      quarterlyTotal: "$12",
      effectiveMonthlyPrice: "$4/mo",
      quarterlySavings: "Save $3",
      features: [
        "Basic wellness insights",
        "Daily health tips",
        "Community access",
        "Email support",
      ],
    },
    {
      name: "Premium",
      iconType: "crown",
      popular: true,
      badge: "Most Popular",
      monthlyPrice: "$10",
      quarterlyPrice: "$25",
      monthlyTotal: "$10",
      quarterlyTotal: "$25",
      effectiveMonthlyPrice: "$8/mo",
      quarterlySavings: "Save $5",
      features: [
        "All Essential features",
        "Personalized wellness plans",
        "Priority support",
        "Advanced analytics",
        "Exclusive content",
      ],
    },
  ],
};

const checkoutFaqs = [
  {
    question: "How can I upgrade to Premium if I am on Essential?",
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
      "We do not offer refunds once payment is made. We provide a free trial so you can evaluate our service before subscribing.",
  },
];

const Checkout = () => {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [searchParams] = useSearchParams();

  const userId =
    searchParams.get("phone") ??
    searchParams.get("phoneNumber") ??
    searchParams.get("mobile") ??
    "";

  const normalizedUserId = useMemo(() => userId.replace(/\D/g, ""), [userId]);

  const region: "india" | "international" = useMemo(
    () => (isIndianPhoneNumber(userId) ? "india" : "international"),
    [userId]
  );

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
        amount: parsePriceStringToMinorUnits(price),
        totalCount: 12,
        customerNotify: 1,
        phoneNumber: normalizedUserId,
        metadata: {
          region: regionKey,
          plan: planNameKey,
          term: billingTerm,
          user_id: normalizedUserId || undefined,
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
      prefill: normalizedUserId ? { contact: normalizedUserId } : undefined,
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
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 -z-10 rounded-xl bg-gold/20 blur-xl" />
                  <div className="w-20 h-20 md:w-28 md:h-28 mx-auto rounded-2xl shadow-lg bg-gold/10 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl">🏔️</span>
                  </div>
                </div>
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
                  className={`pointer-events-none block h-5 w-5 rounded-full bg-cream shadow-lg ring-0 transition-transform ${
                    isQuarterly ? "translate-x-7" : "translate-x-1"
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
