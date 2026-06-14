'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  Flame,
  Layers,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { GOALS, SLA_HOURS } from '@/lib/constants';
import {
  FOUNDING_COHORT_SIZE,
  FOUNDING_FREE_END_LABEL,
  getMarketCopy,
  isFoundingFree,
} from '@/lib/founding';
import { formatInr, getPriceForGoal } from '@/lib/pricing';
import type { GoalId } from '@/lib/constants';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrustSection } from '@/components/trust-section';
import { HeroSection } from '@/components/landing/hero-section';
import { MobileCtaBar } from '@/components/landing/mobile-cta-bar';
import { Reveal } from '@/components/landing/reveal';
import { SectionHeader } from '@/components/landing/section-header';
import { FaqSection } from '@/components/landing/faq-section';
import { GoalCarousel } from '@/components/landing/goal-carousel';
import { TrainingActivityStrip } from '@/components/landing/training-activity-strip';
import { TrainingGallery } from '@/components/landing/training-gallery';
import { LANDING_IMAGES } from '@/lib/landing-images';
import { BarbellDivider } from '@/components/landing/barbell-divider';
import { cn } from '@/lib/utils';

const GOAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  first_meet: Trophy,
  increase_total: TrendingUp,
  improve_squat: Target,
  improve_bench: Dumbbell,
  improve_deadlift: Zap,
  powerbuilding: Layers,
  general_strength: Shield,
  fat_loss_strength: Flame,
};

const STEPS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Log your training profile',
    desc: 'Goals, maxes, injuries, equipment — 15 minutes. Competing? Add federation & meet date.',
    image: LANDING_IMAGES.steps[0],
  },
  {
    step: '02',
    icon: Dumbbell,
    title: 'We write your block',
    desc: 'Volume, intensity, and progression — rules engine + coach review. Sheet & PDF in 12h.',
    image: LANDING_IMAGES.steps[1],
  },
  {
    step: '03',
    icon: Trophy,
    title: 'Train & progress',
    desc: 'Follow the program, hit PRs, or show up on meet day — whatever your goal is.',
    image: LANDING_IMAGES.steps[2],
  },
];

const PRICING_PAID = [
  {
    name: 'Founding Program',
    price: '₹499',
    desc: '8–12 week block for the first 100 athletes',
    featured: true,
    tag: 'Best value',
    futurePrice: undefined as string | undefined,
  },
  {
    name: 'Standard Block',
    price: '₹799',
    desc: 'Personalized strength programming for any goal',
    featured: false,
    futurePrice: undefined as string | undefined,
  },
  {
    name: 'Meet Prep',
    price: '₹1,499',
    desc: '12–16 week peak + attempt selection guide',
    featured: false,
    futurePrice: undefined as string | undefined,
  },
];

const PRICING_FOUNDING = [
  {
    name: 'Founding Program',
    price: 'Free',
    futurePrice: '₹499',
    desc: `Coach-reviewed Excel block — first ${FOUNDING_COHORT_SIZE} athletes`,
    featured: true,
    tag: 'Founding cohort',
  },
  {
    name: 'Standard Block',
    price: 'Free',
    futurePrice: '₹799',
    desc: 'Strength, powerbuilding, or general SBD',
    featured: false,
  },
  {
    name: 'Meet Prep',
    price: 'Free',
    futurePrice: '₹1,499',
    desc: '12–16 week meet-focused peak',
    featured: false,
  },
];

export function LandingPage() {
  const [spotStats, setSpotStats] = useState<{
    count: number;
    target: number;
    full?: boolean;
  } | null>(null);
  const foundingFree = isFoundingFree();
  const marketCopy = getMarketCopy();
  const pricingTiers = foundingFree ? PRICING_FOUNDING : PRICING_PAID;

  useEffect(() => {
    const statsUrl = foundingFree
      ? apiUrl('/intake/stats')
      : apiUrl('/waitlist');
    fetch(statsUrl)
      .then((r) => r.json())
      .then((data) => {
        if (foundingFree) {
          setSpotStats({
            count: data.cohortCount ?? 0,
            target: data.cohortSize ?? FOUNDING_COHORT_SIZE,
            full: data.cohortFull,
          });
        } else {
          setSpotStats({
            count: data.count,
            target: data.target ?? FOUNDING_COHORT_SIZE,
            full: data.full,
          });
        }
      })
      .catch(() => null);
  }, [foundingFree]);

  return (
    <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
      <HeroSection
        spotCount={spotStats?.count}
        spotTarget={spotStats?.target}
        spotsFull={spotStats?.full}
        foundingFree={foundingFree}
      />

      <TrainingActivityStrip />
      <BarbellDivider />

      <TrainingGallery />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Training blocks"
            title="Pick your training goal"
            description="Every program is built around your goal, numbers, and timeline — meet prep, strength, or powerbuilding."
          />
        </Reveal>

        <Reveal delay={60}>
          <GoalCarousel count={GOALS.length}>
            {GOALS.map((goal) => {
              const Icon = GOAL_ICONS[goal.id] ?? Target;
              return (
                <div
                  key={goal.id}
                  className="w-[78vw] max-w-[280px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink"
                >
                  <Link
                    href={`/intake?goal=${goal.id}`}
                    className="group block h-full"
                  >
                    <Card className="h-full border-border/70 bg-card/60 transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:hover:-translate-y-1">
                      <CardHeader className="pb-2">
                        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/12 transition-colors group-hover:bg-primary/20">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <CardTitle className="text-base leading-snug group-hover:text-primary">
                          {goal.label}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {goal.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between pt-0">
                        <p className="text-sm font-semibold text-primary">
                          {foundingFree
                            ? 'Free · founding cohort'
                            : `from ${formatInr(getPriceForGoal(goal.id as GoalId))}`}
                        </p>
                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </GoalCarousel>
        </Reveal>
      </section>

      <TrustSection />

      <section className="border-y border-border bg-muted/15 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader
              eyebrow="Process"
              title="How it works"
              description="Three steps from questionnaire to your coach-reviewed block."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((item, i) => (
              <Reveal key={item.step} delay={i * 80}>
                <Card className="relative h-full overflow-hidden border-border/60 bg-card/50">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <div className="absolute right-4 top-4 font-mono text-4xl font-bold text-primary/25">
                      {item.step}
                    </div>
                  </div>
                  <CardHeader className="relative">
                    <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/12">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit border-primary/30 text-primary"
                    >
                      Step {item.step}
                    </Badge>
                    <CardTitle className="mt-3">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <Reveal>
          <SectionHeader
            eyebrow={marketCopy.pricingEyebrow}
            title={marketCopy.pricingTitle}
            description={marketCopy.pricingDescription}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 70}>
              <div
                className={cn(
                  'flex h-full flex-col',
                  tier.featured && 'md:-translate-y-2',
                )}
              >
                {tier.featured && (
                  <div className="flex justify-center">
                    <Badge className="relative z-10 -mb-3 bg-primary px-3 py-0.5 text-primary-foreground shadow-sm">
                      {tier.tag}
                    </Badge>
                  </div>
                )}
                <Card
                  className={cn(
                    'h-full flex-1 text-center transition-all duration-300',
                    tier.featured
                      ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border/70 bg-card/50',
                  )}
                >
                  <CardHeader className={tier.featured ? 'pt-5' : 'pt-6'}>
                    <CardTitle>{tier.name}</CardTitle>
                    <p className="text-4xl font-bold tracking-tight text-primary">
                      {tier.price}
                    </p>
                    {tier.futurePrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        Then {tier.futurePrice}
                      </p>
                    )}
                    <CardDescription>{tier.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="/intake"
                      className={cn(
                        buttonVariants({
                          variant: tier.featured ? 'default' : 'outline',
                        }),
                        'w-full',
                      )}
                    >
                      {foundingFree ? 'Apply free' : 'Get started'}
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
        {foundingFree && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Paid pricing after {FOUNDING_FREE_END_LABEL}. Founding athletes lock
            in ₹499 rates when we switch.
          </p>
        )}
      </section>

      <section className="relative overflow-hidden border-y border-border">
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
              Ready to train with a plan built for{' '}
              <span className="text-primary">your goal</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Strength, powerbuilding, or meet prep — coach-reviewed and
              delivered in {SLA_HOURS} hours.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/intake"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 gap-2 px-8 text-base shadow-lg shadow-primary/20',
                )}
              >
                {foundingFree
                  ? 'Start free founding block'
                  : 'Start training block'}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/waitlist"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 px-8 text-base',
                )}
              >
                {foundingFree ? 'Reserve a spot' : 'Join waitlist'}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection />

      <MobileCtaBar />
    </div>
  );
}
