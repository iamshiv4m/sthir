'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { SthirMark } from '@/components/brand/sthir-logo';
import { cn } from '@/lib/utils';
import { isFoundingFree } from '@/lib/founding';

const navLinks = [
  { href: '/partners', label: 'Gyms' },
  { href: '/waitlist', label: 'Waitlist' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const foundingFree = isFoundingFree();
  const ctaLabel = foundingFree ? 'Free block' : 'Start Block';

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <SthirMark height={36} priority />
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            STHIR<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/intake" className={buttonVariants({ size: 'sm' })}>
            {ctaLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/intake"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'h-11 min-w-[5.5rem] px-3 text-xs',
            )}
          >
            {ctaLabel}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/80 bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/intake"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
            >
              {ctaLabel}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
