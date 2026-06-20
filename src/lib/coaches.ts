export const COACHES = [
  { id: 'manthan', name: 'Manthan Tiwari' },
  { id: 'dharmesh', name: 'Dharmesh Sharma' },
  { id: 'founder', name: 'Shivam (Founder)' },
] as const;

export type CoachId = (typeof COACHES)[number]['id'];
