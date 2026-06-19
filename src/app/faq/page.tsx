import type { Metadata } from "next";
import { faqs } from "@/lib/data/faqs";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about shipping, returns, products, and workshops.",
};

export default function FaqPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <PageBreadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="font-heading text-3xl font-semibold">Frequently Asked Questions</h1>

      {categories.map((category) => (
        <div key={category} className="mt-8">
          <h2 className="font-heading text-lg font-semibold">{category}</h2>
          <Accordion type="single" collapsible className="mt-2">
            {faqs
              .filter((f) => f.category === category)
              .map((f) => (
                <AccordionItem key={f.question} value={f.question}>
                  <AccordionTrigger>{f.question}</AccordionTrigger>
                  <AccordionContent>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
