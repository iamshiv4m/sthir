import { Suspense } from "react";
import IntakeForm from "./intake-form";

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <IntakeForm />
    </Suspense>
  );
}
