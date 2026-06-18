import { Suspense } from 'react';
import WaitlistForm from './waitlist-form';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { isFoundingFree } from '@/lib/founding';

const foundingFree = isFoundingFree();

export const metadata: Metadata = pageMetadata({
  title: 'Join the Waitlist',
  description: foundingFree
    ? 'Email updates for the next Sthir cohort — no program on waitlist. Apply on intake for your free 4-week block.'
    : 'Join the Sthir waitlist — coach-reviewed strength programs for Indian athletes.',
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
