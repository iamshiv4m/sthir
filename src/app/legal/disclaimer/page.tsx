import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Training Disclaimer",
  description: "Medical and competition disclaimers for Sthir coach-reviewed training programs.",
  path: "/legal/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage title="Training disclaimer" updated="June 2026">
      <p>
        Sthir provides general strength training programming based on information you provide.
        This is <strong>not</strong> medical advice, physical therapy, or a substitute for
        consultation with a qualified healthcare provider.
      </p>
      <p>
        You should consult a physician before beginning any exercise program, especially if you
        have pre-existing injuries, cardiovascular conditions, or are pregnant.
      </p>
      <p>
        You assume full responsibility for your training decisions. Stop exercising and seek
        medical attention if you experience pain, dizziness, or unusual symptoms.
      </p>
      <p>
        Sthir coaches review programs for training appropriateness but cannot guarantee
        competition results or injury prevention.
      </p>
      <h2>Competition & federation</h2>
      <p>
        Federation rules vary by organization and meet. Sthir provides general guidance — verify
        rules with your meet director. Sthir is not affiliated with IPF, Powerlifting India, WRPF,
        or any governing body unless explicitly stated.
      </p>
      <p>By using Sthir you confirm you are 18 years or older (or have guardian consent).</p>
    </LegalPage>
  );
}
