import { LandingPage } from "@/components/landing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Personalized Strength Programs for India",
  description:
    "Coach-reviewed strength & powerlifting programs delivered in 12 hours. Meet prep, powerbuilding, and general strength — built for Indian athletes.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <LandingPage />
    </>
  );
}
