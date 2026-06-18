import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const lifts = [
  { name: 'Squat', sets: '3×5 @ 75%', load: '75 kg' },
  { name: 'Bench Press', sets: '3×5 @ 75%', load: '52.5 kg' },
];

export function ProgramPreviewCard() {
  return (
    <Card className="border-primary/25 bg-card shadow-md ring-1 ring-primary/10">
      <CardHeader className="space-y-2 pb-1">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/10"
          >
            Week 1 · Founding block
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            4 weeks
          </span>
        </div>
        <p className="text-base font-semibold">Day 1 · Squat + bench</p>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        {lifts.map((lift) => (
          <div
            key={lift.name}
            className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{lift.name}</p>
              <p className="text-xs text-muted-foreground">{lift.sets}</p>
            </div>
            <span className="font-mono text-xs text-primary">{lift.load}</span>
          </div>
        ))}
        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Coach note:</span>{' '}
          Built from your intake — goal, maxes, and equipment.
        </p>
      </CardContent>
    </Card>
  );
}
