import type { Metadata } from 'next';
import PlayClient from './PlayClient';

export const metadata: Metadata = {
  title: 'Erinnerung abspielen | MalinKiddy',
  description: 'Öffentliche Wiedergabe einer QR-Audio-Erinnerung.'
};

export default function PlayPage() {
  return <PlayClient />;
}
