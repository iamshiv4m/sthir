import { apiUrl } from './api';
import { getSessionId, getUtm } from './analytics';

export type IntakeDraftPayload = {
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
  equipment: Record<string, boolean>;
  injuries: string[];
  injuryNotes: string;
  sleepQuality: number;
  recoveryNotes: string;
  referralCode: string;
};

function hasContactInfo(form: Partial<IntakeDraftPayload>): boolean {
  const email = form.email?.trim();
  const name = form.name?.trim();
  const digits = (form.phone ?? '').replace(/\D/g, '');
  return (
    (email?.includes('@') ?? false) ||
    digits.length >= 10 ||
    (name?.length ?? 0) >= 2
  );
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Auto-save partial intake — fires when user has name, email, or phone. */
export function saveIntakeDraft(
  step: number,
  stepName: string,
  form: Partial<IntakeDraftPayload>,
  immediate = false,
) {
  if (typeof window === 'undefined' || !hasContactInfo(form)) return;

  const payload = {
    sessionId: getSessionId(),
    stepReached: step,
    stepName,
    answers: form,
    utm: getUtm(),
  };

  const send = () => {
    fetch(apiUrl('/intake/draft'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* never block UX */
    });
  };

  if (immediate) {
    if (debounceTimer) clearTimeout(debounceTimer);
    send();
    return;
  }

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(send, 1500);
}

export function flushIntakeDraft(
  step: number,
  stepName: string,
  form: Partial<IntakeDraftPayload>,
) {
  saveIntakeDraft(step, stepName, form, true);
}
