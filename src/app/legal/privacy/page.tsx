import { LegalPage } from '@/components/legal-page';
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    "How Sthir collects, uses, and protects your training data under India's DPDP Act.",
  path: '/legal/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="June 2026">
      <p>
        Sthir respects your privacy under India&apos;s Digital Personal Data
        Protection Act (DPDP). We collect only what we need to deliver your
        program.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Name, email, phone — to deliver your program and support you</li>
        <li>
          Age, bodyweight, training history, SBD maxes — to personalize
          programming
        </li>
        <li>Injury and recovery notes — for safe load selection</li>
        <li>Payment references via Razorpay — we never store card numbers</li>
      </ul>
      <h2>What we do not do</h2>
      <p>We do not sell your data to advertisers or third-party brokers.</p>
      <h2>Retention</h2>
      <p>
        Program data is kept for up to 3 years after your last interaction.
        Payment records are retained for tax compliance (7 years).
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of your data by emailing
        privacy@sthir.in. We will verify your identity before processing
        requests.
      </p>
      <h2>Processors</h2>
      <p>
        We use Razorpay (payments), Render (API hosting), Neon (database), and
        Vercel (website). Data is encrypted in transit (TLS).
      </p>
    </LegalPage>
  );
}
