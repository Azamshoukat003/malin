import type { Metadata } from 'next';
import AdminQrCodesClient from './AdminQrCodesClient';

export const metadata: Metadata = {
  title: 'QR-Codes verwalten | MalinKiddy Admin',
  description: 'Suche, Filter und Löschaktionen für QR-Codes.'
};

export default function AdminQrCodesPage() {
  return <AdminQrCodesClient />;
}
