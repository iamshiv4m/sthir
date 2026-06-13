import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6')}
      >
        ← Back to home
      </Link>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {updated}
      </p>
      <div className="prose prose-invert mt-8 max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
