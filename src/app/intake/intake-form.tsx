'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import {
  GOALS,
  FEDERATIONS,
  EXPERIENCE_LEVELS,
  GYM_TYPES,
  TRAINING_STYLES,
  INJURY_OPTIONS,
  SLA_HOURS,
} from '@/lib/constants';
import {
  goalLabel,
  federationLabel,
  experienceLabel,
  gymTypeLabel,
  trainingStyleLabel,
  isMeetFocusedGoal,
  isOfficeGoal,
} from '@/lib/labels';
import {
  foundingCopy,
  getMarketCopy,
  isFoundingFree,
  FOUNDING_FREE_WEEKS,
} from '@/lib/founding';
import { FormField, FormSelect } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  validateIntakeStep,
  validateAllIntakeSteps,
} from '@/lib/intake-validation';
import { firstError, type FieldErrors } from '@/lib/form-validation';
import { ANALYTICS_EVENTS, track, getSessionId } from '@/lib/analytics';
import { saveIntakeDraft, flushIntakeDraft } from '@/lib/intake-draft';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

const STEPS = ['Goal', 'Profile', 'Lifts', 'Training', 'Health', 'Review'];

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  rack: 'Power rack',
  bench: 'Bench',
  bands: 'Resistance bands',
  chains: 'Chains',
  deadliftPlatform: 'Deadlift platform',
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

function inputClass(hasError?: boolean) {
  return cn(hasError && 'border-destructive aria-invalid:border-destructive');
}

function firstStepWithErrors(form: FormState): number {
  for (let s = 0; s <= 5; s += 1) {
    if (Object.keys(validateIntakeStep(s, form)).length > 0) return s;
  }
  return 0;
}

export default function IntakeForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<FormState>({
    goal: params.get('goal') ?? 'first_meet',
    email: '',
    name: '',
    phone: '',
    age: 25,
    gender: 'male',
    heightCm: 175,
    bodyweightKg: 80,
    weightClass: '',
    experience: 'intermediate',
    federation: 'ipf_pi',
    squat1rm: 100,
    bench1rm: 70,
    deadlift1rm: 130,
    trainingDays: 4,
    trainingStyle: 'mixed',
    meetDate: '',
    gymType: 'warehouse',
    equipment: defaultEquipment,
    injuries: [] as string[],
    injuryNotes: '',
    sleepQuality: 3,
    recoveryNotes: '',
    disclaimerAccepted: false,
    referralCode: params.get('ref') ?? '',
  });

  const meetFocused = isMeetFocusedGoal(form.goal);
  const officeFocused = isOfficeGoal(form.goal);

  useEffect(() => {
    track(ANALYTICS_EVENTS.intakeStarted, { goal: form.goal });
  }, []);

  useEffect(() => {
    track(ANALYTICS_EVENTS.intakeStepViewed, {
      step,
      stepName: STEPS[step],
      goal: form.goal,
    });
  }, [step, form.goal]);

  useEffect(() => {
    if (step < 1) return;
    saveIntakeDraft(step, STEPS[step], form);
  }, [
    step,
    form.name,
    form.email,
    form.phone,
    form.age,
    form.goal,
    form.experience,
    form.federation,
    form.squat1rm,
    form.bench1rm,
    form.deadlift1rm,
  ]);

  function toggleInjury(injury: string) {
    setForm((f) => ({
      ...f,
      injuries: f.injuries.includes(injury)
        ? f.injuries.filter((i) => i !== injury)
        : [...f.injuries, injury],
    }));
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function applyStepErrors(errors: FieldErrors) {
    setFieldErrors(errors);
    setError(firstError(errors) ?? '');
  }

  function goNext() {
    const errors = validateIntakeStep(step, form);
    if (Object.keys(errors).length > 0) {
      track(ANALYTICS_EVENTS.intakeValidationFailed, {
        step,
        stepName: STEPS[step],
        fields: Object.keys(errors),
      });
      applyStepErrors(errors);
      return;
    }
    track(ANALYTICS_EVENTS.intakeStepCompleted, {
      step,
      stepName: STEPS[step],
      goal: form.goal,
    });
    flushIntakeDraft(step + 1, STEPS[step + 1] ?? STEPS[step], form);
    setFieldErrors({});
    setError('');
    setStep((s) => s + 1);
  }

  async function submit() {
    const errors = validateAllIntakeSteps(form);
    if (Object.keys(errors).length > 0) {
      track(ANALYTICS_EVENTS.intakeValidationFailed, {
        step,
        stepName: STEPS[step],
        fields: Object.keys(errors),
        phase: 'submit',
      });
      applyStepErrors(errors);
      setStep(firstStepWithErrors(form));
      return;
    }
    setLoading(true);
    setError('');
    flushIntakeDraft(step, STEPS[step], form);
    try {
      const res = await fetch(apiUrl('/intake'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          disclaimerAccepted: true,
          sessionId: getSessionId(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          typeof data.message === 'string'
            ? data.message
            : typeof data.error === 'string'
              ? data.error
              : JSON.stringify(data.error ?? data);
        track(ANALYTICS_EVENTS.intakeSubmitFailed, {
          goal: form.goal,
          error: message.slice(0, 200),
        });
        throw new Error(message);
      }
      track(ANALYTICS_EVENTS.intakeSubmitted, {
        goal: form.goal,
        intakeId: data.id,
        foundingFree: data.foundingFree,
        freeSlot: data.freeSlot,
      });
      router.push(`/intake/success?id=${data.id}&mock=${data.mock}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const foundingFree = isFoundingFree();
  const marketCopy = getMarketCopy();

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-2xl px-4 py-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {foundingFree
              ? 'Founding cohort · 4 weeks'
              : 'Program questionnaire'}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Tell us about your training
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            ~15 minutes ·{' '}
            {foundingFree
              ? foundingCopy.intakeReviewLine(SLA_HOURS)
              : `Coach-reviewed program delivered in ${SLA_HOURS} hours`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}:{' '}
          <span className="font-medium text-foreground">{STEPS[step]}</span>
        </p>
        <Progress value={progress} className="mt-3 h-2" />

        <div className="mt-8 space-y-4">
          {step === 0 && (
            <>
              <FormField label="Primary goal" error={fieldErrors.goal}>
                <FormSelect
                  value={form.goal}
                  onValueChange={(goal) => {
                    setForm({
                      ...form,
                      goal,
                      ...(isOfficeGoal(goal)
                        ? {
                            trainingDays: 3,
                            gymType: 'office_gym',
                          }
                        : {}),
                    });
                    clearFieldError('goal');
                  }}
                  options={GOALS.map((g) => ({ value: g.id, label: g.label }))}
                  placeholder="Choose your goal"
                />
              </FormField>
              {meetFocused && (
                <Alert>
                  <AlertDescription>
                    Meet prep goals need your <strong>federation</strong> and{' '}
                    <strong>meet date</strong> — we&apos;ll ask on the next
                    steps so your peak matches IPF/PI or WRPF rules.
                  </AlertDescription>
                </Alert>
              )}
              {officeFocused && (
                <Alert>
                  <AlertDescription>
                    <strong>Office / 9–5 plan</strong> — we&apos;ll build a{' '}
                    <strong>3-day block</strong> (~45–60 min) for before work or
                    evening sessions. Training days default to 3; tell us your
                    gym type on the next steps.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <FormField label="Full name" error={fieldErrors.name}>
                <Input
                  required
                  aria-invalid={!!fieldErrors.name}
                  className={inputClass(!!fieldErrors.name)}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    clearFieldError('name');
                  }}
                />
              </FormField>
              <FormField label="Email" error={fieldErrors.email}>
                <Input
                  required
                  type="email"
                  aria-invalid={!!fieldErrors.email}
                  className={inputClass(!!fieldErrors.email)}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    clearFieldError('email');
                  }}
                />
              </FormField>
              <FormField label="WhatsApp number" error={fieldErrors.phone}>
                <Input
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={!!fieldErrors.phone}
                  className={inputClass(!!fieldErrors.phone)}
                  placeholder="10-digit number for program delivery"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    clearFieldError('phone');
                  }}
                />
              </FormField>
              <p className="text-xs text-muted-foreground">
                We save your progress so we can follow up on WhatsApp if you
                don&apos;t finish — only for completing your program request.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Age" error={fieldErrors.age}>
                  <Input
                    required
                    type="number"
                    min={16}
                    max={70}
                    aria-invalid={!!fieldErrors.age}
                    className={inputClass(!!fieldErrors.age)}
                    value={form.age}
                    onChange={(e) => {
                      setForm({ ...form, age: +e.target.value });
                      clearFieldError('age');
                    }}
                  />
                </FormField>
                <FormField label="Gender" error={fieldErrors.gender}>
                  <FormSelect
                    value={form.gender}
                    onValueChange={(gender) => {
                      setForm({ ...form, gender });
                      clearFieldError('gender');
                    }}
                    options={[...GENDER_OPTIONS]}
                    placeholder="Select gender"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Height (cm)" error={fieldErrors.heightCm}>
                  <Input
                    required
                    type="number"
                    min={120}
                    max={230}
                    aria-invalid={!!fieldErrors.heightCm}
                    className={inputClass(!!fieldErrors.heightCm)}
                    value={form.heightCm}
                    onChange={(e) => {
                      setForm({ ...form, heightCm: +e.target.value });
                      clearFieldError('heightCm');
                    }}
                  />
                </FormField>
                <FormField
                  label="Bodyweight (kg)"
                  error={fieldErrors.bodyweightKg}
                >
                  <Input
                    required
                    type="number"
                    min={40}
                    max={200}
                    aria-invalid={!!fieldErrors.bodyweightKg}
                    className={inputClass(!!fieldErrors.bodyweightKg)}
                    value={form.bodyweightKg}
                    onChange={(e) => {
                      setForm({ ...form, bodyweightKg: +e.target.value });
                      clearFieldError('bodyweightKg');
                    }}
                  />
                </FormField>
              </div>
              <FormField label="Federation" error={fieldErrors.federation}>
                <FormSelect
                  value={form.federation}
                  onValueChange={(federation) => {
                    setForm({ ...form, federation });
                    clearFieldError('federation');
                  }}
                  options={FEDERATIONS.map((f) => ({
                    value: f.id,
                    label: f.label,
                  }))}
                  placeholder="Select federation"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Peaking and attempt selection differ between IPF/PI and WRPF —
                  pick the federation you plan to compete in.
                </p>
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Squat 1RM (kg)" error={fieldErrors.squat1rm}>
                  <Input
                    required
                    type="number"
                    min={20}
                    max={500}
                    aria-invalid={!!fieldErrors.squat1rm}
                    className={inputClass(!!fieldErrors.squat1rm)}
                    value={form.squat1rm}
                    onChange={(e) => {
                      setForm({ ...form, squat1rm: +e.target.value });
                      clearFieldError('squat1rm');
                    }}
                  />
                </FormField>
                <FormField label="Bench 1RM (kg)" error={fieldErrors.bench1rm}>
                  <Input
                    required
                    type="number"
                    min={20}
                    max={350}
                    aria-invalid={!!fieldErrors.bench1rm}
                    className={inputClass(!!fieldErrors.bench1rm)}
                    value={form.bench1rm}
                    onChange={(e) => {
                      setForm({ ...form, bench1rm: +e.target.value });
                      clearFieldError('bench1rm');
                    }}
                  />
                </FormField>
                <FormField
                  label="Deadlift 1RM (kg)"
                  error={fieldErrors.deadlift1rm}
                >
                  <Input
                    required
                    type="number"
                    min={20}
                    max={500}
                    aria-invalid={!!fieldErrors.deadlift1rm}
                    className={inputClass(!!fieldErrors.deadlift1rm)}
                    value={form.deadlift1rm}
                    onChange={(e) => {
                      setForm({ ...form, deadlift1rm: +e.target.value });
                      clearFieldError('deadlift1rm');
                    }}
                  />
                </FormField>
              </div>
              <p className="text-sm text-muted-foreground">
                Total: {form.squat1rm + form.bench1rm + form.deadlift1rm} kg
              </p>
              <FormField label="Experience" error={fieldErrors.experience}>
                <FormSelect
                  value={form.experience}
                  onValueChange={(experience) => {
                    setForm({ ...form, experience });
                    clearFieldError('experience');
                  }}
                  options={EXPERIENCE_LEVELS.map((e) => ({
                    value: e.id,
                    label: e.label,
                  }))}
                  placeholder="Select experience"
                />
              </FormField>
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                label="Training days per week"
                error={fieldErrors.trainingDays}
              >
                <Input
                  required
                  type="number"
                  min={2}
                  max={6}
                  aria-invalid={!!fieldErrors.trainingDays}
                  className={inputClass(!!fieldErrors.trainingDays)}
                  value={form.trainingDays}
                  onChange={(e) => {
                    setForm({ ...form, trainingDays: +e.target.value });
                    clearFieldError('trainingDays');
                  }}
                />
              </FormField>
              <FormField
                label="Training style"
                error={fieldErrors.trainingStyle}
              >
                <FormSelect
                  value={form.trainingStyle}
                  onValueChange={(trainingStyle) => {
                    setForm({ ...form, trainingStyle });
                    clearFieldError('trainingStyle');
                  }}
                  options={TRAINING_STYLES.map((t) => ({
                    value: t.id,
                    label: t.label,
                  }))}
                  placeholder="Select training style"
                />
              </FormField>
              <FormField label="Gym type" error={fieldErrors.gymType}>
                <FormSelect
                  value={form.gymType}
                  onValueChange={(gymType) => {
                    setForm({ ...form, gymType });
                    clearFieldError('gymType');
                  }}
                  options={GYM_TYPES.map((g) => ({
                    value: g.id,
                    label: g.label,
                  }))}
                  placeholder="Select gym type"
                />
              </FormField>
              <FormField
                label={meetFocused ? 'Meet date' : 'Meet date (optional)'}
                error={fieldErrors.meetDate}
              >
                <Input
                  required={meetFocused}
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  aria-invalid={!!fieldErrors.meetDate}
                  className={inputClass(!!fieldErrors.meetDate)}
                  value={form.meetDate}
                  onChange={(e) => {
                    setForm({ ...form, meetDate: e.target.value });
                    clearFieldError('meetDate');
                  }}
                />
                {meetFocused && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required for meet prep — we back-plan your peak from this
                    date.
                  </p>
                )}
              </FormField>
              <FormField
                label="Equipment available"
                error={fieldErrors.equipment}
              >
                <div className="flex flex-wrap gap-3">
                  {Object.entries(form.equipment).map(([key, val]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={val}
                        onCheckedChange={(checked) => {
                          setForm({
                            ...form,
                            equipment: {
                              ...form.equipment,
                              [key]: checked === true,
                            },
                          });
                          clearFieldError('equipment');
                        }}
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
              <FormField
                label="Injuries / limitations"
                error={fieldErrors.injuries}
              >
                <div className="flex flex-wrap gap-2">
                  {INJURY_OPTIONS.map((inj) => (
                    <Badge
                      key={inj}
                      variant={
                        form.injuries.includes(inj) ? 'default' : 'outline'
                      }
                      className="min-h-9 cursor-pointer px-3 py-1.5 text-sm"
                      onClick={() => {
                        toggleInjury(inj);
                        clearFieldError('injuries');
                      }}
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
                  onChange={(e) =>
                    setForm({ ...form, injuryNotes: e.target.value })
                  }
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
                    setForm({
                      ...form,
                      sleepQuality: typeof val === 'number' ? val : 3,
                    });
                  }}
                />
              </FormField>
              <FormField label="Recovery notes">
                <Textarea
                  rows={2}
                  value={form.recoveryNotes}
                  onChange={(e) =>
                    setForm({ ...form, recoveryNotes: e.target.value })
                  }
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
                    <strong>WhatsApp:</strong> {form.phone}
                  </p>
                  <p>
                    <strong>SBD:</strong> {form.squat1rm}/{form.bench1rm}/
                    {form.deadlift1rm} kg
                  </p>
                  <p>
                    <strong>Experience:</strong>{' '}
                    {experienceLabel(form.experience)}
                  </p>
                  <p>
                    <strong>Federation:</strong>{' '}
                    {federationLabel(form.federation)}
                  </p>
                  {form.meetDate && (
                    <p>
                      <strong>Meet date:</strong>{' '}
                      {new Date(form.meetDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  <p>
                    <strong>Training:</strong> {form.trainingDays} days/week ·{' '}
                    {trainingStyleLabel(form.trainingStyle)} ·{' '}
                    {gymTypeLabel(form.gymType)}
                  </p>
                  {form.injuries.length > 0 && (
                    <p>
                      <strong>Injuries:</strong> {form.injuries.join(', ')}
                    </p>
                  )}
                  <p className="pt-2 font-medium text-primary">
                    {foundingFree
                      ? `Founding cohort — ${FOUNDING_FREE_WEEKS}-week Excel block · coach review within ${SLA_HOURS}h`
                      : `Coach-reviewed delivery within ${SLA_HOURS}h`}
                  </p>
                </CardContent>
              </Card>
              <div
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-4',
                  fieldErrors.disclaimerAccepted
                    ? 'border-destructive'
                    : 'border-border',
                )}
              >
                <Checkbox
                  id="disclaimer"
                  checked={form.disclaimerAccepted}
                  onCheckedChange={(checked) => {
                    setForm({ ...form, disclaimerAccepted: checked === true });
                    clearFieldError('disclaimerAccepted');
                  }}
                />
                <Label
                  htmlFor="disclaimer"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  I understand this is not medical advice. I accept the{' '}
                  <Link
                    href="/legal/disclaimer"
                    className="text-primary hover:underline"
                  >
                    training disclaimer
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/legal/refund"
                    className="text-primary hover:underline"
                  >
                    refund policy
                  </Link>
                  .
                </Label>
              </div>
              {fieldErrors.disclaimerAccepted && (
                <p className="text-sm text-destructive" role="alert">
                  {fieldErrors.disclaimerAccepted}
                </p>
              )}
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
              setError('');
              setFieldErrors({});
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
            <Button
              type="button"
              className="min-h-11 px-6"
              disabled={loading}
              onClick={submit}
            >
              {loading ? 'Submitting...' : marketCopy.intakeSubmit}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
