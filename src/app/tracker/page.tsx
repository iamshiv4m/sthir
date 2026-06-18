import Link from 'next/link';
import { ArrowRight, Dumbbell } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function TrackerPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <Badge variant="secondary" className="mb-4">
        Coming soon
      </Badge>
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Dumbbell className="size-7 text-primary" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Workout tracker
      </h1>
      <p className="mt-3 text-muted-foreground">
        Log sets, RPE, and PRs against your Sthir block — launching after the
        founding cohort. For now, follow your coach&apos;s Excel sheet.
      </p>

      <Card className="mt-10 text-left">
        <CardHeader>
          <CardTitle className="text-lg">Need a program now?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Apply on intake — your coach builds a 4-week Excel block from your
            training profile and sends it on WhatsApp within 12 hours.
          </p>
          <Link
            href="/intake"
            className={cn(buttonVariants(), 'inline-flex gap-2')}
          >
            Get your block
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
