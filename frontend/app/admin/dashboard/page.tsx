import type { Metadata } from 'next';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | MalinKiddy',
  description: 'Kennzahlen und letzte Aktivitäten im Admin-Bereich.'
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
