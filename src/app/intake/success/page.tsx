import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SLA_HOURS } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Program Confirmed",
  description: "Your Sthir program is in the coach review queue.",
  path: "/intake/success",
  noIndex: true,
});

const timeline = [
  {
    title: "Payment confirmed",
    desc: "Your intake is in our queue. You'll get a reference ID below.",
  },
  {
    title: "Coach review",
    desc: `A real coach reviews your program — goal, timeline, injuries, and weak points.`,
  },
  {
    title: "Delivery",
    desc: `Google Sheet + PDF within ${SLA_HOURS} hours. We email you when it's ready.`,
  },
  {
    title: "Train",
    desc: "Follow Week 1 Day 1. Reply to us if anything looks off — revision before you start heavy.",
  },
];

export default async function IntakeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; mock?: string }>;
}) {
  const { id, mock } = await searchParams;
  const isMock = mock === "true";

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">You&apos;re in!</h1>
        <p className="mt-3 text-muted-foreground">
          {isMock
            ? "Payment simulated (dev mode). Your program is in the coach review queue."
            : `Payment received. Your personalized program will be reviewed and delivered within ${SLA_HOURS} hours.`}
        </p>
        {id && (
          <Badge variant="secondary" className="mt-4 font-mono">
            Ref: {id.slice(0, 8)}
          </Badge>
        )}
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-lg">What happens next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {timeline.map((item, i) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {i + 1}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Questions? Email support@sthir.in with your reference ID.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "text-center")}>
          Back to home
        </Link>
        <Link
          href="/legal/refund"
          className={cn(buttonVariants({ variant: "outline" }), "text-center")}
        >
          Refund policy
        </Link>
      </div>
    </div>
  );
}
