import { Suspense } from "react";
import WaitlistForm from "./waitlist-form";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Join the Waitlist",
  description:
    "Reserve a founding spot for Sthir — coach-reviewed strength programs for India from ₹499.",
  path: "/waitlist",
});

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted-foreground">Loading...</div>}>
      <WaitlistForm />
    </Suspense>
  );
}
