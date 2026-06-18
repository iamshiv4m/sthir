import { apiUrl } from './api';

export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  intakeStarted: 'intake_started',
  intakeStepViewed: 'intake_step_viewed',
  intakeStepCompleted: 'intake_step_completed',
  intakeValidationFailed: 'intake_validation_failed',
  intakeSubmitted: 'intake_submitted',
  intakeSubmitFailed: 'intake_submit_failed',
  waitlistStarted: 'waitlist_started',
  waitlistValidationFailed: 'waitlist_validation_failed',
  waitlistSubmitted: 'waitlist_submitted',
  waitlistSubmitFailed: 'waitlist_submit_failed',
  ctaClicked: 'cta_clicked',
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

const SESSION_KEY = 'sthir_sid';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getUtm(): Record<string, string | undefined> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? undefined,
    utm_medium: params.get('utm_medium') ?? undefined,
    utm_campaign: params.get('utm_campaign') ?? undefined,
    ref: params.get('ref') ?? undefined,
  };
}

/** Fire-and-forget funnel event → sthir-api auditLogs (entity: funnel). */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
) {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  if (!sessionId) return;

  const payload = {
    event,
    sessionId,
    path: window.location.pathname,
    properties,
    utm: getUtm(),
  };

  fetch(apiUrl('/events'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* analytics must never block UX */
  });
}

export { getSessionId, getUtm };
