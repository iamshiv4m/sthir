import { Suspense } from "react";
import IntakeForm from "./intake-form";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get Your Training Block",
  description:
    "15-minute questionnaire for a coach-reviewed strength, powerbuilding, or meet prep program — delivered in 12 hours.",
  path: "/intake",
});

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <IntakeForm />
    </Suspense>
  );
}
