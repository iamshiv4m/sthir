'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgramPreviewCard } from '@/components/landing/program-preview-card';
import { SLA_HOURS } from '@/lib/constants';
import { getMarketCopy } from '@/lib/founding';
import { LANDING_IMAGES } from '@/lib/landing-images';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function HeroSection({
  spotCount,
  spotTarget,
  spotsFull,
  foundingFree,
}: {
  spotCount?: number;
  spotTarget?: number;
  spotsFull?: boolean;
  foundingFree: boolean;
}) {
  const copy = getMarketCopy();
  const showSpots = spotCount != null && spotTarget != null && spotCount >= 0;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pb-14 sm:pt-10 lg:pb-20 lg:pt-14">
        <div className="grid items-start gap-6 sm:gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="text-center lg:text-left">
            <Badge
              variant="secondary"
              className="mb-4 border-0 bg-primary/10 px-3 py-0.5 text-xs text-primary"
            >
              {copy.heroBadge}
            </Badge>

            <h1 className="hero-title mx-auto max-w-xl text-[1.875rem] font-bold leading-[1.1] tracking-tight sm:text-[2.75rem] lg:mx-0 lg:max-w-lg">
              Your <span className="text-primary">training block</span> —
              coach-reviewed in {SLA_HOURS} hours.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground lg:mx-0">
              {copy.heroSub}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={spotsFull ? '/waitlist' : '/intake'}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group h-12 gap-2 px-7 text-base shadow-lg shadow-primary/15',
                )}
              >
                {spotsFull ? 'Join waitlist' : copy.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/waitlist"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 px-7 text-base',
                )}
              >
                {copy.secondaryCta}
              </Link>
            </div>

            {showSpots && (
              <p className="mx-auto mt-5 text-xs text-muted-foreground lg:mx-0">
                {spotCount}/{spotTarget}{' '}
                {foundingFree
                  ? 'founding programs claimed'
                  : 'waitlist spots filled'}
                {spotsFull && foundingFree && ' · cohort full'}
              </p>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div
              className="hero-card-glow pointer-events-none absolute -inset-3 rounded-3xl motion-safe:animate-[hero-glow-pulse_5s_ease-in-out_infinite]"
              aria-hidden
            />
            <div className="hero-card-enter relative motion-safe:animate-[hero-card-enter_0.7s_ease-out_both]">
              <figure className="relative mb-4 overflow-hidden rounded-2xl border border-border/70 shadow-lg shadow-black/30">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={LANDING_IMAGES.hero.src}
                    alt={LANDING_IMAGES.hero.alt}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                  <figcaption className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      Warehouse gym · India
                    </p>
                  </figcaption>
                </div>
              </figure>
              <ProgramPreviewCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
