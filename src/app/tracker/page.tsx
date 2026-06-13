"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SetLog = { setNumber: number; weight: number; reps: number; rpe?: number; rir?: number };

export default function TrackerPage() {
  const [email, setEmail] = useState("");
  const [exercise, setExercise] = useState("Squat");
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [sets, setSets] = useState<SetLog[]>([{ setNumber: 1, weight: 0, reps: 0, rpe: 7 }]);
  const [history, setHistory] = useState<{ sessions: unknown[]; prs: unknown[] } | null>(null);

  async function logWorkout() {
    await fetch(apiUrl("/sessions"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, week, day, exercise, sets }),
    });
    loadHistory();
  }

  async function loadHistory() {
    if (!email) return;
    const res = await fetch(apiUrl(`/sessions?email=${encodeURIComponent(email)}`));
    setHistory(await res.json());
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Workout Tracker</h1>
        <Badge variant="secondary">Phase 2 beta</Badge>
      </div>
      <p className="mt-2 text-muted-foreground">Log sets, RPE/RIR, auto PR tracking</p>

      <Card className="mt-8">
        <CardContent className="space-y-4 pt-6">
          <FormField label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Week">
              <Input type="number" value={week} onChange={(e) => setWeek(+e.target.value)} />
            </FormField>
            <FormField label="Day">
              <Input type="number" value={day} onChange={(e) => setDay(+e.target.value)} />
            </FormField>
            <FormField label="Exercise">
              <Input value={exercise} onChange={(e) => setExercise(e.target.value)} />
            </FormField>
          </div>

          {sets.map((s, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <Input type="number" placeholder="kg" value={s.weight || ""} onChange={(e) => {
                const next = [...sets];
                next[i] = { ...s, weight: +e.target.value };
                setSets(next);
              }} />
              <Input type="number" placeholder="reps" value={s.reps || ""} onChange={(e) => {
                const next = [...sets];
                next[i] = { ...s, reps: +e.target.value };
                setSets(next);
              }} />
              <Input type="number" placeholder="RPE" value={s.rpe ?? ""} onChange={(e) => {
                const next = [...sets];
                next[i] = { ...s, rpe: +e.target.value };
                setSets(next);
              }} />
              <Input type="number" placeholder="RIR" value={s.rir ?? ""} onChange={(e) => {
                const next = [...sets];
                next[i] = { ...s, rir: +e.target.value };
                setSets(next);
              }} />
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" onClick={() =>
              setSets([...sets, { setNumber: sets.length + 1, weight: 0, reps: 0, rpe: 7 }])
            }>
              + Add set
            </Button>
            <Button onClick={logWorkout}>Log workout</Button>
            <Button variant="outline" onClick={loadHistory}>Load history</Button>
          </div>
        </CardContent>
      </Card>

      {history && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>PR History</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto text-xs text-muted-foreground">
              {JSON.stringify(history.prs, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
