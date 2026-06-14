/** Founding cohort — free beta before public pricing. Toggle via env on Vercel. */
export const FOUNDING_COHORT_SIZE = 20;

/** Free founding offer = one 4-week block only. */
export const FOUNDING_FREE_WEEKS = 4;

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
  heroBadge: 'Founding cohort · Free 4 weeks',
  heroSub:
    'Powerlifting, strength & powerbuilding — personalized for Indian athletes. First 20 athletes get a free 4-week coach-reviewed Excel block. Longer programs coming soon.',
  primaryCta: 'Get free 4-week block',
  /** Shown as text link when free spots remain — not a second equal CTA */
  heroWaitlistLink: 'Not ready? Join waitlist',
  heroWaitlistHint: 'Email updates only — no program until you apply',
  /** Shown as outline button when free spots are full */
  secondaryCta: 'Join waitlist for next cohort',
  intakeSubmit: 'Submit for review',
  intakeReviewLine: (hours: number) =>
    `Founding cohort — free 4-week block, no payment. Coach-reviewed Excel within ${hours} hours.`,
  pricingEyebrow: 'Founding cohort',
  pricingTitle: 'Free 4-week block for founding athletes',
  pricingDescription: (spotsLeft: number | null) =>
    spotsLeft != null && spotsLeft > 0
      ? `${spotsLeft} of ${FOUNDING_COHORT_SIZE} free spots left — one coach-reviewed month (4 weeks). Standard & meet-prep blocks coming soon.`
      : `Free spots filled — founding 4-week block now ₹${FOUNDING_BLOCK_PRICE_INR}. Standard & meet-prep blocks coming soon.`,
  futurePriceNote:
    'Longer 8–16 week blocks and meet prep launch after founding cohort.',
} as const;

export const paidCopy = {
  heroBadge: 'Strength sports · India',
  heroSub:
    'Powerlifting, strength & powerbuilding — personalized for Indian athletes. Sheet + PDF delivered after payment.',
  primaryCta: 'Get Your Block',
  secondaryCta: 'Waitlist — ₹99',
  intakeSubmit: 'Pay & Submit',
  pricingEyebrow: 'Pricing',
  pricingTitle: 'Simple, India-first pricing',
  pricingDescription:
    'One-time program purchase. No subscriptions. Founding rate for early athletes.',
} as const;

export function getMarketCopy() {
  return isFoundingFree() ? foundingCopy : paidCopy;
}

export type FoundingPricingTier = {
  name: string;
  price: string;
  futurePrice?: string;
  desc: string;
  featured?: boolean;
  tag?: string;
  comingSoon?: boolean;
  href?: string;
  cta: string;
};

export function getFoundingPricingTiers(
  cohortFull: boolean,
): FoundingPricingTier[] {
  return [
    {
      name: 'Founding Program',
      price: cohortFull ? `₹${FOUNDING_BLOCK_PRICE_INR}` : 'Free',
      futurePrice: cohortFull ? undefined : `₹${FOUNDING_BLOCK_PRICE_INR}`,
      desc: `4-week coach-reviewed Excel block — first ${FOUNDING_COHORT_SIZE} athletes free`,
      featured: true,
      tag: cohortFull ? 'Founding rate' : 'Founding cohort',
      href: '/intake',
      cta: cohortFull ? `Apply — ₹${FOUNDING_BLOCK_PRICE_INR}` : 'Apply free',
    },
    {
      name: 'Standard Block',
      price: 'Coming soon',
      desc: '8–12 week strength & powerbuilding programs',
      comingSoon: true,
      cta: 'Coming soon',
    },
    {
      name: 'Meet Prep',
      price: 'Coming soon',
      desc: '12–16 week meet-focused peak',
      comingSoon: true,
      cta: 'Coming soon',
    },
  ];
}
