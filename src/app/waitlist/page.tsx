import { Suspense } from 'react';
import WaitlistForm from './waitlist-form';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { isFoundingFree } from '@/lib/founding';

const foundingFree = isFoundingFree();

export const metadata: Metadata = pageMetadata({
  title: foundingFree ? 'Reserve a Founding Spot' : 'Join the Waitlist',
  description: foundingFree
    ? 'Reserve a spot for the next Sthir cohort — free coach-reviewed strength programs for founding athletes in India.'
    : 'Reserve a founding spot for Sthir — coach-reviewed strength programs for India from ₹499.',
  path: '/waitlist',
});

export default function WaitlistPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-muted-foreground">Loading...</div>
      }
    >
      <WaitlistForm />
    </Suspense>
  );
}
