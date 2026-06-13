import {
  GOALS,
  FEDERATIONS,
  EXPERIENCE_LEVELS,
  GYM_TYPES,
  TRAINING_STYLES,
  type GoalId,
} from './constants';

export function goalLabel(id: string): string {
  return GOALS.find((g) => g.id === id)?.label ?? id;
}

export function federationLabel(id: string): string {
  return FEDERATIONS.find((f) => f.id === id)?.label ?? id;
}

export function experienceLabel(id: string): string {
  return EXPERIENCE_LEVELS.find((e) => e.id === id)?.label ?? id;
}

export function gymTypeLabel(id: string): string {
  return GYM_TYPES.find((g) => g.id === id)?.label ?? id;
}

export function trainingStyleLabel(id: string): string {
  return TRAINING_STYLES.find((t) => t.id === id)?.label ?? id;
}

export function isMeetFocusedGoal(goal: string): boolean {
  return (['first_meet', 'increase_total'] as GoalId[]).includes(
    goal as GoalId,
  );
}
