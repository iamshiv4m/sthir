import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Layers, UserCheck } from 'lucide-react';
import { SLA_HOURS } from '@/lib/constants';
import { LANDING_IMAGES } from '@/lib/landing-images';
import { Reveal } from '@/components/landing/reveal';
import { SectionHeader } from '@/components/landing/section-header';

const proofPoints = [
  {
    icon: UserCheck,
    title: 'Human-reviewed',
    desc: 'Every program checked by a real coach before delivery — not auto-generated junk.',
  },
  {
    icon: Layers,
    title: 'Built for your goal',
    desc: 'Meet prep, strength blocks, powerbuilding, or general SBD — templates match what you picked.',
  },
  {
    icon: Clock,
    title: `${SLA_HOURS}-hour delivery`,
    desc: 'Pay → coach review → Google Sheet & PDF. Miss our SLA? Full refund.',
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
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <Card className="mx-auto mt-8 max-w-3xl overflow-hidden border-primary/25 bg-card/80">
            <div className="grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="relative min-h-[200px] sm:min-h-full">
                <Image
                  src={LANDING_IMAGES.coach.src}
                  alt={LANDING_IMAGES.coach.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/90 sm:bg-gradient-to-r sm:from-transparent sm:to-card" />
              </div>
              <CardContent className="flex flex-col justify-center p-6 sm:p-7">
                <Badge
                  variant="secondary"
                  className="mb-2 w-fit border-primary/20 bg-primary/10 text-primary"
                >
                  Founding coach team
                </Badge>
                <p className="font-semibold">
                  Reviewed by coaches who train in India
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Powerlifting meets, strength blocks, and warehouse-gym
                  athletes in Delhi, Mumbai & Bangalore. Adjusted for injuries
                  and weak points — not copy-pasted.
                </p>
              </CardContent>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
