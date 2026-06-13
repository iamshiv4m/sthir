import type { GoalId } from './constants';
import { PRICING } from './constants';

export function getPriceForGoal(goal: GoalId, founding = true): number {
  if (goal === 'first_meet')
    return founding ? PRICING.founding_program : PRICING.meet_prep;
  if (goal === 'fat_loss_strength') return PRICING.fat_loss;
  if (goal === 'increase_total') return PRICING.meet_prep;
  return founding ? PRICING.founding_program : PRICING.standard_program;
}

export function formatInr(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
