"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgramPreviewCard } from "@/components/landing/program-preview-card";
import { SLA_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HeroSection({
  waitlistCount,
  waitlistTarget,
}: {
  waitlistCount?: number;
  waitlistTarget?: number;
}) {
  const showSpots =
    waitlistCount != null && waitlistTarget != null && waitlistCount > 0;

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
              Strength sports · India
            </Badge>

            <h1 className="hero-title mx-auto max-w-xl text-[1.875rem] font-bold leading-[1.1] tracking-tight sm:text-[2.75rem] lg:mx-0 lg:max-w-lg">
              Your <span className="text-primary">training block</span> — coach-reviewed in{" "}
              {SLA_HOURS} hours.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground lg:mx-0">
              Powerlifting, strength & powerbuilding — personalized for Indian athletes. Sheet +
              PDF delivered after payment.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/intake"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-12 gap-2 px-7 text-base shadow-lg shadow-primary/15",
                )}
              >
                Get Your Block
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/waitlist"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-7 text-base",
                )}
              >
                Waitlist — ₹99
              </Link>
            </div>

            {showSpots && (
              <p className="mx-auto mt-5 text-xs text-muted-foreground lg:mx-0">
                {waitlistCount}/{waitlistTarget} founding spots filled
              </p>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div
              className="hero-card-glow pointer-events-none absolute -inset-3 rounded-3xl motion-safe:animate-[hero-glow-pulse_5s_ease-in-out_infinite]"
              aria-hidden
            />
            <div className="hero-card-enter relative motion-safe:animate-[hero-card-enter_0.7s_ease-out_both]">
              <ProgramPreviewCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
