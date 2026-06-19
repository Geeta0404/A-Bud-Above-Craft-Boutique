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
    <section className="border-b border-border bg-card">
      <Reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
