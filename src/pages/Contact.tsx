import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { SITE } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\+?[0-9 ()-]{7,20}$/.test(v), "Enter a valid phone number"),
  message: z.string().trim().min(10, "Please add a few more details").max(4000),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send your message. Please email us directly.");
      return;
    }
    setDone(true);
    toast.success("Message sent. We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 md:py-20">
        <div className="container-peak max-w-xl">
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">Get in touch</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Questions about Peak, partnerships, press, or support — send a message or email{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-ink underline underline-offset-2"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>

          {done ? (
            <div className="mt-12 flex items-center gap-3 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Check className="h-4 w-4" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink">
                Message received
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-12 space-y-6">
              <div>
                <label htmlFor="name" className="eyebrow block mb-2">
                  Name
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-sm border border-ink/20 bg-parchment px-4 py-3 text-ink outline-none focus:border-gold transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="eyebrow block mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-ink/20 bg-parchment px-4 py-3 text-ink outline-none focus:border-gold transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="phone" className="eyebrow block mb-2">
                  Phone <span className="text-clay">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-sm border border-ink/20 bg-parchment px-4 py-3 text-ink outline-none focus:border-gold transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="message" className="eyebrow block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-sm border border-ink/20 bg-parchment px-4 py-3 text-ink outline-none focus:border-gold transition-colors resize-y min-h-[120px]"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-parchment hover:bg-gold hover:text-ink disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending" : "Send message"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Contact;
