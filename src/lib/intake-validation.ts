import { GOALS, FEDERATIONS, EXPERIENCE_LEVELS, GYM_TYPES, TRAINING_STYLES } from './constants';
import { isMeetFocusedGoal } from './labels';
import {
  type FieldErrors,
  isValidEmail,
  isValidMeetDate,
  isValidName,
  isValidNumber,
  isValidPhone,
} from './form-validation';

export type IntakeFormValues = {
  goal: string;
  email: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  heightCm: number;
  bodyweightKg: number;
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
  sleepQuality: number;
  disclaimerAccepted: boolean;
};

const GOAL_IDS = new Set(GOALS.map((g) => g.id));
const FEDERATION_IDS = new Set(FEDERATIONS.map((f) => f.id));
const EXPERIENCE_IDS = new Set(EXPERIENCE_LEVELS.map((e) => e.id));
const GYM_TYPE_IDS = new Set(GYM_TYPES.map((g) => g.id));
const TRAINING_STYLE_IDS = new Set(TRAINING_STYLES.map((t) => t.id));
const GENDER_IDS = new Set(['male', 'female', 'other']);

function requireSelect(
  errors: FieldErrors,
  field: string,
  value: string,
  allowed: Set<string>,
  label: string,
) {
  if (!value || !allowed.has(value)) {
    errors[field] = `Please select ${label}.`;
  }
}

export function validateIntakeStep(
  step: number,
  form: IntakeFormValues,
): FieldErrors {
  const errors: FieldErrors = {};

  switch (step) {
    case 0:
      requireSelect(errors, 'goal', form.goal, GOAL_IDS, 'a goal');
      break;

    case 1:
      if (!isValidName(form.name, 2)) {
        errors.name = 'Full name is required (at least 2 characters).';
      }
      if (!isValidEmail(form.email)) {
        errors.email = 'Enter a valid email address.';
      }
      if (!isValidPhone(form.phone)) {
        errors.phone =
          'Enter a valid 10-digit WhatsApp number (or +91 followed by 10 digits).';
      }
      if (!isValidNumber(form.age, 16, 70)) {
        errors.age = 'Age must be between 16 and 70.';
      }
      requireSelect(errors, 'gender', form.gender, GENDER_IDS, 'gender');
      if (!isValidNumber(form.heightCm, 120, 230)) {
        errors.heightCm = 'Height must be between 120 and 230 cm.';
      }
      if (!isValidNumber(form.bodyweightKg, 40, 200)) {
        errors.bodyweightKg = 'Bodyweight must be between 40 and 200 kg.';
      }
      requireSelect(
        errors,
        'federation',
        form.federation,
        FEDERATION_IDS,
        'a federation',
      );
      break;

    case 2:
      if (!isValidNumber(form.squat1rm, 20, 500)) {
        errors.squat1rm = 'Squat 1RM must be between 20 and 500 kg.';
      }
      if (!isValidNumber(form.bench1rm, 20, 350)) {
        errors.bench1rm = 'Bench 1RM must be between 20 and 350 kg.';
      }
      if (!isValidNumber(form.deadlift1rm, 20, 500)) {
        errors.deadlift1rm = 'Deadlift 1RM must be between 20 and 500 kg.';
      }
      requireSelect(
        errors,
        'experience',
        form.experience,
        EXPERIENCE_IDS,
        'experience level',
      );
      break;

    case 3:
      if (!isValidNumber(form.trainingDays, 2, 6)) {
        errors.trainingDays = 'Training days must be between 2 and 6 per week.';
      }
      requireSelect(
        errors,
        'trainingStyle',
        form.trainingStyle,
        TRAINING_STYLE_IDS,
        'training style',
      );
      requireSelect(errors, 'gymType', form.gymType, GYM_TYPE_IDS, 'gym type');
      if (isMeetFocusedGoal(form.goal)) {
        if (!form.meetDate.trim()) {
          errors.meetDate = 'Meet date is required for meet prep goals.';
        } else if (!isValidMeetDate(form.meetDate)) {
          errors.meetDate = 'Meet date must be today or in the future.';
        }
      } else if (form.meetDate.trim() && !isValidMeetDate(form.meetDate)) {
        errors.meetDate = 'Meet date must be today or in the future.';
      }
      if (!Object.values(form.equipment).some(Boolean)) {
        errors.equipment = 'Select at least one piece of equipment.';
      }
      break;

    case 4:
      if (form.injuries.length === 0) {
        errors.injuries = 'Select at least one option (including None / Minor).';
      }
      if (!isValidNumber(form.sleepQuality, 1, 5)) {
        errors.sleepQuality = 'Sleep quality must be between 1 and 5.';
      }
      break;

    case 5:
      if (!form.disclaimerAccepted) {
        errors.disclaimerAccepted =
          'Please accept the training disclaimer to continue.';
      }
      break;
  }

  return errors;
}

export function validateAllIntakeSteps(form: IntakeFormValues): FieldErrors {
  const merged: FieldErrors = {};
  for (let step = 0; step <= 5; step += 1) {
    Object.assign(merged, validateIntakeStep(step, form));
  }
  return merged;
}

export type WaitlistFormValues = {
  name: string;
  email: string;
  city: string;
  goal: string;
};

export function validateWaitlistForm(form: WaitlistFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!isValidName(form.name, 2)) {
    errors.name = 'Name is required (at least 2 characters).';
  }
  if (!isValidEmail(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  requireSelect(errors, 'goal', form.goal, GOAL_IDS, 'a goal');
  if (form.city.trim().length === 1) {
    errors.city = 'City name is too short.';
  }
  return errors;
}
