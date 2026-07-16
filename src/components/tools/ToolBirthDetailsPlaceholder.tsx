import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ToolBirthDetailsPlaceholderProps = {
  toolName: string;
};

export function ToolBirthDetailsPlaceholder({ toolName }: ToolBirthDetailsPlaceholderProps) {
  const [submitted, setSubmitted] = useState(false);
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/919560057789?text=Hi";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-10 rounded-sm border-2 border-gold/40 bg-gold/5 p-8 text-center">
        <p className="font-display text-2xl text-ink">Preview saved</p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The {toolName} calculator is coming soon to Peak. For a personalized reading today, chat
          with us on WhatsApp.
        </p>
        <Button asChild className="mt-6 bg-gold text-ink hover:bg-gold/90">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Ask on WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6 rounded-sm border border-border p-6 md:p-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold mb-2">Birth details</p>
        <p className="text-sm text-muted-foreground">
          Dummy form — results are not calculated yet. We&apos;ll use this layout when the tool goes live.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" name="dob" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tob">Time of birth</Label>
          <Input id="tob" name="tob" type="time" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="place">Place of birth</Label>
          <Input id="place" name="place" placeholder="City, country" required />
        </div>
      </div>
      <Button type="submit" className="w-full sm:w-auto bg-ink text-parchment hover:bg-ink/90">
        Enter birth details
      </Button>
    </form>
  );
}
