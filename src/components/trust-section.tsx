import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Layers, UserCheck } from "lucide-react";
import { SLA_HOURS } from "@/lib/constants";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeader } from "@/components/landing/section-header";

const proofPoints = [
  {
    icon: UserCheck,
    title: "Human-reviewed",
    desc: "Every program checked by a real coach before delivery — not auto-generated junk.",
  },
  {
    icon: Layers,
    title: "Built for your goal",
    desc: "Meet prep, strength blocks, powerbuilding, or general SBD — templates match what you picked.",
  },
  {
    icon: Clock,
    title: `${SLA_HOURS}-hour delivery`,
    desc: "Pay → coach review → Google Sheet & PDF. Miss our SLA? Full refund.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeader
            eyebrow="Trust"
            title="Why athletes trust Sthir"
            description="Not a generic fitness app. A reviewed block built around your goal, equipment, and timeline — whether you compete or just want to get stronger."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {proofPoints.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <Card className="h-full border-border/60 bg-card/60 transition-colors hover:border-primary/30">
                <CardContent className="pt-6">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/12">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <Card className="mx-auto mt-8 max-w-2xl overflow-hidden border-primary/25 bg-gradient-to-br from-primary/10 via-card/80 to-card/80">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-2xl font-bold text-primary ring-1 ring-primary/20">
                S
              </div>
              <div>
                <Badge variant="secondary" className="mb-2 border-primary/20 bg-primary/10 text-primary">
                  Founding coach team
                </Badge>
                <p className="font-semibold">Reviewed by coaches who train in India</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Powerlifting meets, strength blocks, and warehouse-gym athletes in Delhi, Mumbai
                  & Bangalore. Adjusted for injuries and weak points — not copy-pasted.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
