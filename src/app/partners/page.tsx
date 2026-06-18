import { redirect } from 'next/navigation';

/** Partners program paused — redirect to home until launch. */
export default function PartnersPage() {
  redirect('/');
}
