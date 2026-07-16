import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ToolFaq } from "@/lib/tools";

type ToolFaqListProps = {
  faqs: ToolFaq[];
};

export function ToolFaqList({ faqs }: ToolFaqListProps) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl text-ink mb-6">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.question} value={`faq-${i}`}>
            <AccordionTrigger className="text-left font-display text-lg text-ink hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
