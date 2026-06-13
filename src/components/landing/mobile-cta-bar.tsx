'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Training block</p>
          <p className="truncate text-xs text-muted-foreground">
            Coach-reviewed · 12h · from ₹499
          </p>
        </div>
        <Link
          href="/intake"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-11 shrink-0 gap-1.5 px-5 shadow-lg shadow-primary/25',
          )}
        >
          Train
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
