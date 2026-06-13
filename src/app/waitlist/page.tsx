import { Suspense } from "react";
import WaitlistForm from "./waitlist-form";

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted-foreground">Loading...</div>}>
      <WaitlistForm />
    </Suspense>
  );
}
