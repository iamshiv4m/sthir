/** Founding cohort — free beta before public pricing. Toggle via env on Vercel. */
export const FOUNDING_COHORT_SIZE = 20;

/** Free founding offer = one 4-week block only. */
export const FOUNDING_FREE_WEEKS = 4;

/** Backend-only after free cohort fills — not shown in UI during founding launch. */
export const FOUNDING_BLOCK_PRICE_INR = 499;

export const FOUNDING_FREE_END_LABEL =
  process.env.NEXT_PUBLIC_FOUNDING_FREE_UNTIL ?? 'July 2026';

export function isFoundingFree(): boolean {
  return process.env.NEXT_PUBLIC_FOUNDING_FREE === 'true';
}

/** Use cohort count from API — do not rely on backend freeSlotAvailable alone. */
export function hasFoundingFreeSlots(
  claimed: number,
  target = FOUNDING_COHORT_SIZE,
): boolean {
  return claimed < target;
}

export const foundingCopy = {
  heroBadge: 'Founding cohort · 4 weeks',
  heroSub:
    'Powerlifting, strength & powerbuilding — personalized for Indian athletes. First 20 athletes get a coach-reviewed Excel block built from your intake. Longer programs coming soon.',
  primaryCta: 'Get your 4-week block',
  /** Shown as text link when free spots remain — not a second equal CTA */
  heroWaitlistLink: 'Not ready? Join waitlist',
  heroWaitlistHint: 'Email updates only — no program until you apply',
  /** Shown as outline button when free spots are full */
  secondaryCta: 'Join waitlist for next cohort',
  intakeSubmit: 'Submit for review',
  intakeReviewLine: (hours: number) =>
    `Founding cohort — coach builds your Excel block from this form. Delivered within ${hours} hours after review.`,
  offerEyebrow: 'Founding cohort',
  offerTitle: 'What you get',
  offerDescription: (spotsLeft: number | null) =>
    spotsLeft != null && spotsLeft > 0
      ? `${spotsLeft} of ${FOUNDING_COHORT_SIZE} founding spots left — one coach-reviewed 4-week Excel block.`
      : `Founding spots filled — join the waitlist for the next cohort.`,
  offerFootnote:
    'Longer 8–16 week blocks and meet prep launch after the founding cohort.',
} as const;

export const paidCopy = {
  heroBadge: 'Strength sports · India',
  heroSub:
    'Powerlifting, strength & powerbuilding — personalized for Indian athletes. Coach-reviewed Excel block delivered after you apply.',
  primaryCta: 'Get your block',
  secondaryCta: 'Join waitlist',
  intakeSubmit: 'Submit for review',
  offerEyebrow: 'Programs',
  offerTitle: 'Coach-reviewed blocks',
  offerDescription:
    'Personalized strength programming with human review on every block.',
} as const;

export function getMarketCopy() {
  return isFoundingFree() ? foundingCopy : paidCopy;
}

export type FoundingOfferCard = {
  name: string;
  headline: string;
  desc: string;
  featured?: boolean;
  tag?: string;
  comingSoon?: boolean;
  href?: string;
  cta: string;
};

export function getFoundingOfferCards(
  cohortFull: boolean,
  spotsLeft: number | null,
): FoundingOfferCard[] {
  return [
    {
      name: 'Founding Program',
      headline:
        spotsLeft != null && spotsLeft > 0
          ? `${spotsLeft} spots left`
          : cohortFull
            ? 'Cohort full'
            : 'Limited spots',
      desc: `4-week coach-reviewed Excel block — first ${FOUNDING_COHORT_SIZE} athletes from intake data`,
      featured: true,
      tag: 'Founding cohort',
      href: cohortFull ? '/waitlist' : '/intake',
      cta: cohortFull ? 'Join waitlist' : 'Apply now',
    },
    {
      name: 'Standard Block',
      headline: 'Coming soon',
      desc: '8–12 week strength & powerbuilding programs',
      comingSoon: true,
      cta: 'Coming soon',
    },
    {
      name: 'Meet Prep',
      headline: 'Coming soon',
      desc: '12–16 week meet-focused peak',
      comingSoon: true,
      cta: 'Coming soon',
    },
  ];
}

/** @deprecated Use getFoundingOfferCards — kept for skill sync scripts */
export function getFoundingPricingTiers(cohortFull: boolean) {
  return getFoundingOfferCards(cohortFull, cohortFull ? 0 : 1);
}
