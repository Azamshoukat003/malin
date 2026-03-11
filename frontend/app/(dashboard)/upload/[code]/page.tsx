import type { Metadata } from 'next';
import UploadClient from './UploadClient';

export const metadata: Metadata = {
  title: 'Erinnerung hochladen | MalinKiddy',
  description: 'Audio-Datei für einen QR-Code hochladen.'
};

export default function UploadPage() {
  return <UploadClient />;
}
