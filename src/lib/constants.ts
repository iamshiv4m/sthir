export const GOALS = [
  {
    id: "first_meet",
    label: "First Powerlifting Meet",
    description: "12-week path to your first competition",
  },
  {
    id: "increase_total",
    label: "Increase Total",
    description: "Structured block to add kg to your SBD total",
  },
  {
    id: "improve_squat",
    label: "Improve Squat",
    description: "Squat-focused specialization block",
  },
  {
    id: "improve_bench",
    label: "Improve Bench Press",
    description: "Bench-focused volume & intensity",
  },
  {
    id: "improve_deadlift",
    label: "Improve Deadlift",
    description: "Deadlift technique & strength block",
  },
  {
    id: "powerbuilding",
    label: "Powerbuilding",
    description: "Strength + hypertrophy hybrid",
  },
  {
    id: "general_strength",
    label: "General Strength",
    description: "Balanced SBD progression",
  },
  {
    id: "fat_loss_strength",
    label: "Fat Loss + Maintain Strength",
    description: "Recomp while keeping main lifts",
  },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

export const FEDERATIONS = [
  { id: "ipf_pi", label: "IPF / Powerlifting India (PI)" },
  { id: "wrpf", label: "WRPF India" },
  { id: "other", label: "Other / Unaffiliated" },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner (<1 year)" },
  { id: "novice", label: "Novice (1–2 years)" },
  { id: "intermediate", label: "Intermediate (2–4 years)" },
  { id: "advanced", label: "Advanced (4+ years)" },
] as const;

export const GYM_TYPES = [
  { id: "warehouse", label: "Warehouse / Strength Gym" },
  { id: "commercial", label: "Commercial Gym" },
  { id: "home", label: "Home Gym" },
] as const;

export const TRAINING_STYLES = [
  { id: "rpe", label: "RPE-based" },
  { id: "percentage", label: "Percentage-based" },
  { id: "mixed", label: "Mixed RPE + %" },
] as const;

export const INJURY_OPTIONS = [
  "Lower back",
  "Shoulder",
  "Knee",
  "Hip",
  "Elbow",
  "Wrist",
  "None / Minor",
] as const;

export const SLA_HOURS = 12;

export const PRICING = {
  waitlist_deposit: 9900, // paise = ₹99
  founding_program: 49900,
  standard_program: 79900,
  meet_prep: 149900,
  fat_loss: 69900,
  form_check: 29900,
} as const;

export const ADMIN_API_KEY_HEADER = "x-admin-key";
