/** Founding cohort — free beta before public pricing. Toggle via env on Vercel. */
export const FOUNDING_COHORT_SIZE = 20;

export const FOUNDING_FREE_END_LABEL =
  process.env.NEXT_PUBLIC_FOUNDING_FREE_UNTIL ?? 'July 2026';

export function isFoundingFree(): boolean {
  return process.env.NEXT_PUBLIC_FOUNDING_FREE === 'true';
}

export const foundingCopy = {
  heroBadge: 'Founding cohort · Free',
  heroSub:
    'Powerlifting, strength & powerbuilding — personalized for Indian athletes. Coach-reviewed Excel program within 12 hours. No payment during founding.',
  primaryCta: 'Get free founding block',
  secondaryCta: 'Reserve a spot',
  intakeSubmit: 'Submit for review',
  intakeReviewLine: (hours: number) =>
    `Founding cohort — no payment required. Coach-reviewed Excel sheet within ${hours} hours.`,
  pricingEyebrow: 'Founding cohort',
  pricingTitle: 'Free for founding athletes',
  pricingDescription: `First ${FOUNDING_COHORT_SIZE} programs free while we prove delivery quality. Paid pricing (${FOUNDING_FREE_END_LABEL} onwards) starts soon — founding athletes get locked rates.`,
  futurePriceNote: 'Paid pricing from ₹499 after founding cohort closes.',
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
