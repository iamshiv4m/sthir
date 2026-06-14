'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/landing/reveal';
import { SectionHeader } from '@/components/landing/section-header';
import {
  isFoundingFree,
  FOUNDING_COHORT_SIZE,
  FOUNDING_FREE_WEEKS,
  FOUNDING_BLOCK_PRICE_INR,
} from '@/lib/founding';

function getFaqItems() {
  const foundingFree = isFoundingFree();

  const items = [
    {
      id: 'difference',
      q: 'How is this different from Boostcamp or Hevy?',
      a: 'Those are great loggers with free generic programs. Sthir delivers personalized, coach-reviewed blocks for your goal — strength, powerbuilding, or meet prep.',
    },
    {
      id: 'only-pl',
      q: 'Is this only for powerlifting?',
      a: 'No. We cover meet prep and federation rules for competitors, but also strength blocks, lift specialization, powerbuilding, and general SBD progress. Pick your goal in the questionnaire.',
    },
    ...(foundingFree
      ? [
          {
            id: 'why-free',
            q: 'Why is it free right now?',
            a: `We're in our founding cohort — first ${FOUNDING_COHORT_SIZE} athletes get a free ${FOUNDING_FREE_WEEKS}-week coach-reviewed block. After that, the founding block is ₹${FOUNDING_BLOCK_PRICE_INR}. Longer standard and meet-prep programs are coming soon.`,
          },
        ]
      : []),
    {
      id: 'jai',
      q: 'Why not JuggernautAI?',
      a: foundingFree
        ? 'JAI is excellent but ~₹2,900/month with less India-specific context. Sthir adds a real coach review layer and India meet context — free during founding.'
        : 'JAI is excellent but ~₹2,900/month with less India-specific context. We are priced for Indian athletes with human review on every program.',
    },
    {
      id: 'delivery',
      q: 'What do I actually receive?',
      a: foundingFree
        ? 'A personalized 4-week Excel program — weekly structure, sets, reps, RPE or %, and coach notes. Delivered within 12 hours by email after coach review. Free for the first 20 athletes only.'
        : 'A personalized Google Sheet plus PDF — weekly structure, sets, reps, RPE or %, and coach notes. Delivered within 12 hours of payment.',
    },
    {
      id: 'federations',
      q: 'Which federations do you support?',
      a: "IPF/Powerlifting India (PI) and WRPF India for meet-focused goals. Other goals don't require a federation — we still personalize volume and intensity.",
    },
    {
      id: 'experience',
      q: "I'm new to training / first meet. Is this for me?",
      a: 'Yes. The questionnaire captures experience, equipment, and timeline so your block matches where you are — not an advanced template by default.',
    },
    {
      id: 'refund',
      q: "What's your refund policy?",
      a: foundingFree
        ? 'Founding programs are free — no charge. When paid pricing launches, our standard SLA and refund policy applies.'
        : 'Full refund if we miss the 12-hour delivery SLA. After delivery, we offer revisions for mismatches — see the full policy for details.',
      href: foundingFree ? undefined : '/legal/refund',
    },
  ];

  return items;
}

export function FaqSection() {
  const faqItems = getFaqItems();

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <Reveal>
        <SectionHeader
          eyebrow="FAQ"
          title="Common questions"
          description="Quick answers before you apply — tap to expand."
        />
      </Reveal>

      <Reveal delay={80}>
        <Card className="mt-10 overflow-hidden border-border/70 bg-card/40 shadow-sm">
          <Accordion defaultValue={['difference']} className="w-full">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-border/60 px-4 last:border-b-0 sm:px-5"
              >
                <AccordionTrigger className="py-4 text-base font-semibold hover:text-primary hover:no-underline sm:py-5 sm:text-[1.05rem]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.925rem] leading-relaxed text-muted-foreground">
                  {item.a}
                  {'href' in item && item.href && (
                    <>
                      {' '}
                      <Link
                        href={item.href}
                        className="font-medium text-primary hover:underline"
                      >
                        Read full policy →
                      </Link>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Still stuck? Email{' '}
          <a
            href="mailto:support@sthir.in"
            className="font-medium text-primary hover:underline"
          >
            support@sthir.in
          </a>{' '}
          — we reply within 48 hours.
        </p>
      </Reveal>
    </section>
  );
}
