import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Sthir',
  tagline: 'Strength · Training · Human-In · Reviewed',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'https://sthir.in',
  description:
    'Coach-reviewed strength & powerlifting programs delivered in 12 hours. Meet prep, powerbuilding, and general strength — built for Indian athletes.',
  keywords: [
    'strength program India',
    'powerlifting program India',
    'powerbuilding program India',
    'strength sports India',
    'personalized training program India',
    'coach reviewed workout plan',
  ],
  locale: 'en_IN',
} as const;

export const defaultOgImage = {
  path: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'Sthir — Strength · Training · Human-In · Reviewed. Coach-reviewed programs for India.',
} as const;

export function absoluteUrl(path = ''): string {
  const base = siteConfig.url.replace(/\/$/, '');
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [
        {
          url: defaultOgImage.path,
          width: defaultOgImage.width,
          height: defaultOgImage.height,
          alt: defaultOgImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [defaultOgImage.path],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Sthir — Personalized Strength Programs for India',
    template: '%s | Sthir',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: 'Sthir', url: siteConfig.url }],
  creator: 'Sthir',
  publisher: 'Sthir',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: defaultOgImage.path,
        width: defaultOgImage.width,
        height: defaultOgImage.height,
        alt: defaultOgImage.alt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'Coach-reviewed strength programs for India.',
    images: [defaultOgImage.path],
  },
};

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${absoluteUrl('/')}#organization`,
        name: siteConfig.name,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/brand/sthir-logo-mark.png'),
        description: siteConfig.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${absoluteUrl('/')}#website`,
        name: siteConfig.name,
        url: absoluteUrl('/'),
        description: siteConfig.description,
        publisher: { '@id': `${absoluteUrl('/')}#organization` },
        inLanguage: 'en-IN',
      },
    ],
  };
}
