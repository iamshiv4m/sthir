import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Refund Policy",
  description: "Sthir refund and revision policy — 12-hour SLA, wrong goal/federation guarantees.",
  path: "/legal/refund",
});

export default function RefundPage() {
  return (
    <LegalPage title="Refund policy" updated="June 2026">
      <h2>Summary</h2>
      <ul>
        <li>
          <strong>Program not delivered within 24 hours</strong> (2× our 12h SLA) — full refund
        </li>
        <li>
          <strong>Wrong goal or federation</strong> after delivery — full refund or free revision
        </li>
        <li>
          <strong>Waitlist ₹99 deposit</strong> — fully refundable until you purchase a program
        </li>
        <li>
          <strong>Change of mind after delivery</strong> — no refund
        </li>
      </ul>
      <h2>After delivery</h2>
      <p>
        Refunds within 7 days if the program clearly mismatches your stated goal or federation.
        We offer a free revision first when the issue is fixable.
      </p>
      <h2>Rejected intakes</h2>
      <p>
        If a coach rejects your intake for safety or bad data, you receive a full automatic
        refund with an explanation within 24 hours.
      </p>
      <h2>How to request</h2>
      <p>
        Email support@sthir.in with your order ID, purchase email, and reason. We respond within
        48 hours; refunds process in 5–7 business days via Razorpay.
      </p>
    </LegalPage>
  );
}
