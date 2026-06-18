'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { GOALS } from '@/lib/constants';
import { goalLabel } from '@/lib/labels';
import { FormField, FormSelect } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { isFoundingFree, FOUNDING_COHORT_SIZE } from '@/lib/founding';
import { validateWaitlistForm } from '@/lib/intake-validation';
import { firstError, type FieldErrors } from '@/lib/form-validation';
import { ANALYTICS_EVENTS, track } from '@/lib/analytics';

export default function WaitlistForm() {
  const foundingFree = isFoundingFree();
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    goal: params.get('goal') ?? 'first_meet',
    referralCode: params.get('ref') ?? '',
    payDeposit: !foundingFree,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle',
  );
  const [result, setResult] = useState<{
    id: string;
    orderId: string;
    mock?: boolean;
  } | null>(null);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    track(ANALYTICS_EVENTS.waitlistStarted, { goal: form.goal });
  }, []);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateWaitlistForm(form);
    if (Object.keys(errors).length > 0) {
      track(ANALYTICS_EVENTS.waitlistValidationFailed, {
        fields: Object.keys(errors),
      });
      setFieldErrors(errors);
      setStatus('error');
      setMessage(firstError(errors) ?? 'Please fix the errors below.');
      return;
    }
    setFieldErrors({});
    setStatus('loading');
    try {
      const res = await fetch(apiUrl('/waitlist'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg =
          typeof data.message === 'string'
            ? data.message
            : typeof data.error === 'string'
              ? data.error
              : 'Failed';
        track(ANALYTICS_EVENTS.waitlistSubmitFailed, {
          goal: form.goal,
          error: errMsg.slice(0, 200),
        });
        throw new Error(errMsg);
      }
      track(ANALYTICS_EVENTS.waitlistSubmitted, {
        goal: form.goal,
        waitlistId: data.id,
      });
      setStatus('done');
      setResult({ id: data.id, orderId: data.orderId, mock: data.mock });
      setMessage(
        foundingFree
          ? "You're on the list — we'll email when new cohort spots open."
          : data.mock
            ? 'Spot reserved (dev mode). In production you would complete deposit payment.'
            : 'Complete your deposit to lock your spot.',
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'done' && result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="text-center">
          <CheckCircle2 className="mx-auto size-14 text-primary" />
          <h1 className="mt-4 text-3xl font-bold">You&apos;re on the list!</h1>
          <p className="mt-3 text-muted-foreground">{message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="font-mono">
              #{result.id.slice(0, 6).toUpperCase()}
            </Badge>
            {result.orderId && (
              <Badge variant="outline" className="font-mono">
                Order: {result.orderId.slice(0, 8)}
              </Badge>
            )}
          </div>
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle className="text-lg">What happens next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {foundingFree ? (
              <>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary">1.</span>
                  <p>
                    <strong>Spot reserved</strong> — no deposit during founding
                    cohort.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary">2.</span>
                  <p>
                    <strong>Want a program now?</strong> Skip the wait — apply
                    on intake for a coach-reviewed block.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary">3.</span>
                  <p>
                    <strong>We email you</strong> when your cohort opens. Launch
                    updates only — no spam.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary">1.</span>
                  <p>
                    <strong>Deposit confirmed</strong> — fully refundable
                    until you buy a program.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary">2.</span>
                  <p>
                    <strong>Early access locked</strong> — first access when
                    we open intake slots.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary">3.</span>
                  <p>
                    <strong>We email you</strong> when your cohort opens. No
                    spam — just launch updates for {goalLabel(form.goal)}{' '}
                    athletes.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/intake" className={cn(buttonVariants(), 'text-center')}>
            {foundingFree
              ? 'Get program now'
              : 'Skip the wait — get program now'}
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'text-center',
            )}
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border/80">
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-40" />
        <Card className="relative border-0 bg-card/80 shadow-none">
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Waitlist
            </p>
            <CardTitle className="text-2xl">
              Join the Founding Lifters
            </CardTitle>
            <CardDescription>
              {foundingFree
                ? `Want a program now? Apply on intake for a coach-reviewed 4-week block (${FOUNDING_COHORT_SIZE} spots). Waitlist is email updates only — no program.`
                : 'Refundable deposit secures your spot. Limited founding athletes.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <FormField label="Name" error={fieldErrors.name}>
          <Input
            required
            aria-invalid={!!fieldErrors.name}
            className={cn(fieldErrors.name && 'border-destructive')}
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
            className={cn(fieldErrors.email && 'border-destructive')}
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              clearFieldError('email');
            }}
          />
        </FormField>
        <FormField label="City (optional)" error={fieldErrors.city}>
          <Input
            placeholder="Delhi, Mumbai, Bangalore..."
            value={form.city}
            onChange={(e) => {
              setForm({ ...form, city: e.target.value });
              clearFieldError('city');
            }}
          />
        </FormField>
        <FormField label="Primary goal" error={fieldErrors.goal}>
          <FormSelect
            value={form.goal}
            onValueChange={(goal) => {
              setForm({ ...form, goal });
              clearFieldError('goal');
            }}
            options={GOALS.map((g) => ({ value: g.id, label: g.label }))}
            placeholder="Choose your goal"
          />
        </FormField>
        <FormField label="Referral code (optional)">
          <Input
            value={form.referralCode}
            onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
          />
        </FormField>
        {!foundingFree && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Checkbox
              id="deposit"
              checked={form.payDeposit}
              onCheckedChange={(checked) =>
                setForm({ ...form, payDeposit: checked === true })
              }
            />
            <Label htmlFor="deposit" className="text-sm text-muted-foreground">
              Pay refundable deposit now
            </Label>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Join Waitlist'}
        </Button>
      </form>

      {message && status === 'error' && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {!foundingFree && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Deposit fully refundable per our{' '}
          <Link href="/legal/refund" className="text-primary hover:underline">
            refund policy
          </Link>
          .
        </p>
      )}
    </div>
  );
}
