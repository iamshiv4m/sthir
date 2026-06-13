import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock } from "lucide-react";

const lifts = [
  { name: "Competition Squat", sets: "4×3 @ 82%", load: "127.5 kg" },
  { name: "Pause Squat", sets: "3×4 @ 70%", load: "108 kg" },
];

export function ProgramPreviewCard() {
  return (
    <Card className="border-primary/25 bg-card shadow-md ring-1 ring-primary/10">
      <CardHeader className="space-y-2 pb-1">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
            Week 8 · Training
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            Meet −5 wks
          </span>
        </div>
        <p className="text-base font-semibold">Competition squat day · Meet prep</p>
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
          <span className="font-medium text-foreground">Coach note:</span> Volume trimmed — 5
          weeks out.
        </p>
      </CardContent>
    </Card>
  );
}
