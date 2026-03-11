import type { Metadata } from 'next';
import ConfirmClient from './ConfirmClient';

export const metadata: Metadata = {
  title: 'E-Mail gesendet | MalinKiddy',
  description: 'Bitte prüfe dein Postfach.'
};

export default function ConfirmPage() {
  return <ConfirmClient />;
}
