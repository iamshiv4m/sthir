import { Suspense } from 'react';
import IntakeForm from './intake-form';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { isFoundingFree } from '@/lib/founding';

const foundingFree = isFoundingFree();

export const metadata: Metadata = pageMetadata({
  title: foundingFree ? 'Apply for Founding Block' : 'Get Your Training Block',
  description: foundingFree
    ? '15-minute questionnaire — free coach-reviewed strength program for founding athletes. Excel delivery within 12 hours.'
    : '15-minute questionnaire for a coach-reviewed strength, powerbuilding, or meet prep program — delivered in 12 hours.',
  path: '/intake',
});

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <IntakeForm />
    </Suspense>
  );
}
