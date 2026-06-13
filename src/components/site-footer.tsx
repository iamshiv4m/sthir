import Link from "next/link";
import { SthirMark } from "@/components/brand/sthir-logo";

const legalLinks = [
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/refund", label: "Refunds" },
  { href: "/legal/privacy", label: "Privacy" },
];

const platformLinks = [
  { href: "/intake", label: "Get your block" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/partners", label: "Gym partners" },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const showDesignSystem = process.env.NODE_ENV === "development";

  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
              <SthirMark height={44} />
              <span className="text-xl font-bold tracking-tight">
                STHIR<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Coach-reviewed strength programs for Indian athletes.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              Strength · Focus · Progress
            </p>
          </div>

          <FooterLinkGroup title="Legal" links={legalLinks} />

          <FooterLinkGroup
            title="Platform"
            links={
              showDesignSystem
                ? [...platformLinks, { href: "/design-system", label: "Design system" }]
                : platformLinks
            }
          />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sthir — India Strength Sports Platform</p>
          <p>Not medical advice. Train smart.</p>
        </div>
      </div>
    </footer>
  );
}
