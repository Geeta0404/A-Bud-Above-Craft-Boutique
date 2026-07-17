import { Leaf, ShieldCheck, Headset, Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

const items = [
  { icon: Leaf, title: "Quality Materials", body: "Always the best, naturally sourced." },
  { icon: ShieldCheck, title: "Eco-Friendly", body: "Kind to the planet, by design." },
  { icon: Headset, title: "Great Support", body: "We're here to help, always." },
  { icon: Sparkles, title: "Expert Care", body: "Ready to impress, every time." },
];

export function TrustBar() {
  return (
    <section className="bg-card">
      <Reveal className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {items.map(({ icon: Icon, title, body }, index) => (
            <div
              key={title}
              className={`group flex flex-col items-center gap-4 text-center transition-transform duration-300 hover:-translate-y-1 ${index > 0 ? "lg:pl-12" : ""}`}
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <div className="space-y-1.5">
                <p className="text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary">{title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
