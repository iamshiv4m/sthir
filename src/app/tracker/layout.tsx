import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Workout Tracker — Coming Soon',
  description:
    'Session logging and PR tracking for Sthir athletes — launching after the founding cohort.',
  path: '/tracker',
  noIndex: true,
});

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
