import type { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export const metadata: Metadata = {
  title: 'Upload erfolgreich | MalinKiddy',
  description: 'Deine Erinnerung wurde erfolgreich gespeichert.'
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="container"><div className="mk-skeleton" /></main>}>
      <SuccessClient />
    </Suspense>
  );
}
