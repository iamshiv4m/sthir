/** Shared client-side validators for intake & waitlist forms. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length > 0 && EMAIL_RE.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^91[6-9]\d{9}$/.test(digits);
  }
  return false;
}

export function isValidName(name: string, min = 2): boolean {
  return name.trim().length >= min;
}

export function isValidNumber(
  value: number,
  min: number,
  max: number,
): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function isValidMeetDate(date: string): boolean {
  if (!date.trim()) return false;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
}

export type FieldErrors = Record<string, string>;

export function firstError(errors: FieldErrors): string | null {
  const values = Object.values(errors);
  return values.length > 0 ? values[0] : null;
}
