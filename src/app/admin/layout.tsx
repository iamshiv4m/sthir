import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Admin',
  description: 'Sthir coach review queue.',
  path: '/admin',
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
