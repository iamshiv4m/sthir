"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import {
  GOALS,
  FEDERATIONS,
  EXPERIENCE_LEVELS,
  GYM_TYPES,
  TRAINING_STYLES,
  INJURY_OPTIONS,
  SLA_HOURS,
} from "@/lib/constants";
import {
  goalLabel,
  federationLabel,
  experienceLabel,
  gymTypeLabel,
  trainingStyleLabel,
  isMeetFocusedGoal,
} from "@/lib/labels";
import { formatInr, getPriceForGoal } from "@/lib/pricing";
import type { GoalId } from "@/lib/constants";
import { FormField, NativeSelect } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const STEPS = ["Goal", "Profile", "Lifts", "Training", "Health", "Review"];

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: "Barbell",
  rack: "Power rack",
  bench: "Bench",
  bands: "Resistance bands",
  chains: "Chains",
  deadliftPlatform: "Deadlift platform",
};

const defaultEquipment = {
  barbell: true,
  rack: true,
  bench: true,
  bands: false,
  chains: false,
  deadliftPlatform: false,
};

type FormState = {
  goal: string;
  email: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  heightCm: number;
  bodyweightKg: number;
  weightClass: string;
  experience: string;
  federation: string;
  squat1rm: number;
  bench1rm: number;
  deadlift1rm: number;
  trainingDays: number;
  trainingStyle: string;
  meetDate: string;
  gymType: string;
  equipment: typeof defaultEquipment;
  injuries: string[];
  injuryNotes: string;
  sleepQuality: number;
  recoveryNotes: string;
  disclaimerAccepted: boolean;
  referralCode: string;
};

function validateStep(step: number, form: FormState): string | null {
  switch (step) {
    case 0:
      if (!form.goal) return "Please select a goal.";
      return null;
    case 1:
      if (!form.name.trim()) return "Full name is required.";
      if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required.";
      if (form.age < 16 || form.age > 70) return "Age must be between 16 and 70.";
      if (form.bodyweightKg < 40 || form.bodyweightKg > 200) return "Enter a realistic bodyweight.";
      return null;
    case 2:
      if (form.squat1rm < 20 || form.bench1rm < 20 || form.deadlift1rm < 20) {
        return "Enter realistic 1RM values (minimum 20 kg each).";
      }
      return null;
    case 3:
      if (form.trainingDays < 2 || form.trainingDays > 6) {
        return "Training days must be between 2 and 6 per week.";
      }
      if (isMeetFocusedGoal(form.goal) && !form.meetDate) {
        return "Meet date is required for meet prep goals — we need it to plan your peak.";
      }
      return null;
    case 4:
      return null;
    default:
      return null;
  }
}

export default function IntakeForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    goal: params.get("goal") ?? "first_meet",
    email: "",
    name: "",
    phone: "",
    age: 25,
    gender: "male",
    heightCm: 175,
    bodyweightKg: 80,
    weightClass: "",
    experience: "intermediate",
    federation: "ipf_pi",
    squat1rm: 100,
    bench1rm: 70,
    deadlift1rm: 130,
    trainingDays: 4,
    trainingStyle: "mixed",
    meetDate: "",
    gymType: "warehouse",
    equipment: defaultEquipment,
    injuries: [] as string[],
    injuryNotes: "",
    sleepQuality: 3,
    recoveryNotes: "",
    disclaimerAccepted: false,
    referralCode: params.get("ref") ?? "",
  });

  const meetFocused = isMeetFocusedGoal(form.goal);

  function toggleInjury(injury: string) {
    setForm((f) => ({
      ...f,
      injuries: f.injuries.includes(injury)
        ? f.injuries.filter((i) => i !== injury)
        : [...f.injuries, injury],
    }));
  }

  function goNext() {
    const err = validateStep(step, form);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  }

  async function submit() {
    if (!form.disclaimerAccepted) {
      setError("Please accept the training disclaimer to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/intake"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, disclaimerAccepted: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data.error));
      router.push(`/intake/success?id=${data.id}&mock=${data.mock}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-2xl px-4 py-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Program questionnaire
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Tell us about your training
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            ~15 minutes · Coach-reviewed program delivered in {SLA_HOURS} hours
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <p className="text-sm text-muted-foreground">
        Step {step + 1} of {STEPS.length}: <span className="font-medium text-foreground">{STEPS[step]}</span>
      </p>
      <Progress value={progress} className="mt-3 h-2" />

      <div className="mt-8 space-y-4">
        {step === 0 && (
          <>
            <FormField label="Primary goal">
              <NativeSelect
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
              >
                {GOALS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <p className="text-sm font-medium text-primary">
              Price: {formatInr(getPriceForGoal(form.goal as GoalId))}
            </p>
            {meetFocused && (
              <Alert>
                <AlertDescription>
                  Meet prep goals need your <strong>federation</strong> and{" "}
                  <strong>meet date</strong> — we&apos;ll ask on the next steps so your peak
                  matches IPF/PI or WRPF rules.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <FormField label="Full name">
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="Email">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
            <FormField label="Phone (WhatsApp)">
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Age">
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: +e.target.value })}
                />
              </FormField>
              <FormField label="Gender">
                <NativeSelect
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </NativeSelect>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Height (cm)">
                <Input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: +e.target.value })}
                />
              </FormField>
              <FormField label="Bodyweight (kg)">
                <Input
                  type="number"
                  value={form.bodyweightKg}
                  onChange={(e) => setForm({ ...form, bodyweightKg: +e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Federation">
              <NativeSelect
                value={form.federation}
                onChange={(e) => setForm({ ...form, federation: e.target.value })}
              >
                {FEDERATIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </NativeSelect>
              <p className="mt-1 text-xs text-muted-foreground">
                Peaking and attempt selection differ between IPF/PI and WRPF — pick the federation
                you plan to compete in.
              </p>
            </FormField>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Squat 1RM (kg)">
                <Input
                  type="number"
                  value={form.squat1rm}
                  onChange={(e) => setForm({ ...form, squat1rm: +e.target.value })}
                />
              </FormField>
              <FormField label="Bench 1RM (kg)">
                <Input
                  type="number"
                  value={form.bench1rm}
                  onChange={(e) => setForm({ ...form, bench1rm: +e.target.value })}
                />
              </FormField>
              <FormField label="Deadlift 1RM (kg)">
                <Input
                  type="number"
                  value={form.deadlift1rm}
                  onChange={(e) => setForm({ ...form, deadlift1rm: +e.target.value })}
                />
              </FormField>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {form.squat1rm + form.bench1rm + form.deadlift1rm} kg
            </p>
            <FormField label="Experience">
              <NativeSelect
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              >
                {EXPERIENCE_LEVELS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </>
        )}

        {step === 3 && (
          <>
            <FormField label="Training days per week">
              <Input
                type="number"
                min={2}
                max={6}
                value={form.trainingDays}
                onChange={(e) => setForm({ ...form, trainingDays: +e.target.value })}
              />
            </FormField>
            <FormField label="Training style">
              <NativeSelect
                value={form.trainingStyle}
                onChange={(e) => setForm({ ...form, trainingStyle: e.target.value })}
              >
                {TRAINING_STYLES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Gym type">
              <NativeSelect
                value={form.gymType}
                onChange={(e) => setForm({ ...form, gymType: e.target.value })}
              >
                {GYM_TYPES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label={meetFocused ? "Meet date" : "Meet date (optional)"}>
              <Input
                type="date"
                value={form.meetDate}
                onChange={(e) => setForm({ ...form, meetDate: e.target.value })}
              />
              {meetFocused && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Required for meet prep — we back-plan your peak from this date.
                </p>
              )}
            </FormField>
            <FormField label="Equipment available">
              <div className="flex flex-wrap gap-3">
                {Object.entries(form.equipment).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={val}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          equipment: { ...form.equipment, [key]: checked === true },
                        })
                      }
                    />
                    {EQUIPMENT_LABELS[key] ?? key}
                  </label>
                ))}
              </div>
            </FormField>
          </>
        )}

        {step === 4 && (
          <>
            <FormField label="Injuries / limitations">
              <div className="flex flex-wrap gap-2">
                {INJURY_OPTIONS.map((inj) => (
                  <Badge
                    key={inj}
                    variant={form.injuries.includes(inj) ? "default" : "outline"}
                    className="min-h-9 cursor-pointer px-3 py-1.5 text-sm"
                    onClick={() => toggleInjury(inj)}
                  >
                    {inj}
                  </Badge>
                ))}
              </div>
            </FormField>
            <FormField label="Injury notes">
              <Textarea
                rows={3}
                value={form.injuryNotes}
                onChange={(e) => setForm({ ...form, injuryNotes: e.target.value })}
              />
            </FormField>
            <FormField label={`Sleep quality: ${form.sleepQuality}/5`}>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[form.sleepQuality]}
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  setForm({ ...form, sleepQuality: typeof val === "number" ? val : 3 });
                }}
              />
            </FormField>
            <FormField label="Recovery notes">
              <Textarea
                rows={2}
                value={form.recoveryNotes}
                onChange={(e) => setForm({ ...form, recoveryNotes: e.target.value })}
              />
            </FormField>
          </>
        )}

        {step === 5 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Review your submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Goal:</strong> {goalLabel(form.goal)}
                </p>
                <p>
                  <strong>Athlete:</strong> {form.name} ({form.email})
                </p>
                <p>
                  <strong>SBD:</strong> {form.squat1rm}/{form.bench1rm}/{form.deadlift1rm} kg
                </p>
                <p>
                  <strong>Experience:</strong> {experienceLabel(form.experience)}
                </p>
                <p>
                  <strong>Federation:</strong> {federationLabel(form.federation)}
                </p>
                {form.meetDate && (
                  <p>
                    <strong>Meet date:</strong>{" "}
                    {new Date(form.meetDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                <p>
                  <strong>Training:</strong> {form.trainingDays} days/week ·{" "}
                  {trainingStyleLabel(form.trainingStyle)} · {gymTypeLabel(form.gymType)}
                </p>
                {form.injuries.length > 0 && (
                  <p>
                    <strong>Injuries:</strong> {form.injuries.join(", ")}
                  </p>
                )}
                <p className="pt-2 font-medium text-primary">
                  Total: {formatInr(getPriceForGoal(form.goal as GoalId))} — delivered within{" "}
                  {SLA_HOURS}h
                </p>
              </CardContent>
            </Card>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Checkbox
                id="disclaimer"
                checked={form.disclaimerAccepted}
                onCheckedChange={(checked) =>
                  setForm({ ...form, disclaimerAccepted: checked === true })
                }
              />
              <Label htmlFor="disclaimer" className="text-sm leading-relaxed text-muted-foreground">
                I understand this is not medical advice. I accept the{" "}
                <Link href="/legal/disclaimer" className="text-primary hover:underline">
                  training disclaimer
                </Link>{" "}
                and{" "}
                <Link href="/legal/refund" className="text-primary hover:underline">
                  refund policy
                </Link>
                .
              </Label>
            </div>
          </>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-8 flex justify-between gap-3 pb-4">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          className="min-h-11 px-5"
          onClick={() => {
            setError("");
            setStep((s) => s - 1);
          }}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" className="min-h-11 px-6" onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button type="button" className="min-h-11 px-6" disabled={loading} onClick={submit}>
            {loading ? "Submitting..." : "Pay & Submit"}
          </Button>
        )}
      </div>
      </div>
    </div>
  );
}