import { Activity, CalendarDays, Dumbbell, Gauge, Weight } from "lucide-react";

const METRICS = [
  { icon: Weight, label: "Strength focus", value: "SBD + more", sub: "Goal-based blocks" },
  { icon: Gauge, label: "Intensity", value: "RPE 7–9", sub: "Or %-based" },
  { icon: CalendarDays, label: "Frequency", value: "4 days/wk", sub: "Flexible split" },
  { icon: Activity, label: "Block length", value: "8–16 wks", sub: "Goal-aligned" },
  { icon: Dumbbell, label: "Programs", value: "8 goals", sub: "PL · strength · recomp" },
];

export function TrainingActivityStrip() {
  return (
    <section className="border-y border-border/80 bg-muted/30 py-4">
      <div className="overflow-hidden">
        <div className="flex w-max gap-3 px-4 motion-safe:animate-[training-ticker_40s_linear_infinite] sm:mx-auto sm:w-full sm:max-w-6xl sm:animate-none sm:grid sm:grid-cols-5 sm:gap-2">
          {[...METRICS, ...METRICS].map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className="flex min-w-[148px] shrink-0 items-center gap-2.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5 sm:min-w-0"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/12">
                <item.icon className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="truncate font-mono text-sm font-bold text-foreground">{item.value}</p>
                <p className="truncate text-[0.65rem] text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
