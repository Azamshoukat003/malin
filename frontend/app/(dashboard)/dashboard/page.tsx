import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Meine Erinnerungen | MalinKiddy',
  description: 'Übersicht über alle aufgenommenen Erinnerungen.'
};

export default function DashboardPage() {
  return <DashboardClient />;
}
