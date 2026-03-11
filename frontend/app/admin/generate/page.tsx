import type { Metadata } from 'next';
import AdminGenerateClient from './AdminGenerateClient';

export const metadata: Metadata = {
  title: 'QR-Codes generieren | MalinKiddy Admin',
  description: 'Neue QR-Code Batchs erstellen und als CSV exportieren.'
};

export default function AdminGeneratePage() {
  return <AdminGenerateClient />;
}
