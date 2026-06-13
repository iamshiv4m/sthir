'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoalCarousel({
  children,
  count,
}: {
  children: React.ReactNode;
  count: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < maxScroll - 6);
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScroll();
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [updateScroll]);

  function scrollBy(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth',
    });
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3 sm:hidden">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronLeft className="size-3.5 shrink-0 text-primary/70" />
          <span>
            Swipe to explore{' '}
            <span className="font-medium text-foreground">
              {count} programs
            </span>
          </span>
          <ChevronRight
            className={cn(
              'size-3.5 shrink-0 text-primary',
              canScrollRight && 'motion-safe:animate-pulse',
            )}
          />
        </p>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label="Scroll programs left"
            disabled={!canScrollLeft}
            onClick={() => scrollBy('left')}
            className="flex size-11 items-center justify-center rounded-lg border border-border/70 bg-card/80 text-muted-foreground transition-colors enabled:hover:border-primary/40 enabled:hover:text-primary disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll programs right"
            disabled={!canScrollRight}
            onClick={() => scrollBy('right')}
            className="flex size-11 items-center justify-center rounded-lg border border-border/70 bg-card/80 text-muted-foreground transition-colors enabled:hover:border-primary/40 enabled:hover:text-primary disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative sm:static">
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 sm:hidden',
            canScrollLeft ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-background via-background/90 to-transparent transition-opacity duration-300 sm:hidden',
            canScrollRight ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden
        />

        <div
          ref={scrollRef}
          className="-mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 snap-x snap-proximity scrollbar-none after:min-w-2 after:shrink-0 after:content-[''] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none sm:after:content-none lg:grid-cols-4"
        >
          {children}
        </div>
      </div>

      <div className="mt-4 h-1 px-4 sm:hidden">
        <div className="h-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary will-change-[width]"
            style={{ width: `${Math.max(20, scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
