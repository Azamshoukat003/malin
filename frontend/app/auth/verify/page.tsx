import type { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export const metadata: Metadata = {
  title: 'Anmeldung prüfen | MalinKiddy',
  description: 'Prüfung des Magic-Links.'
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<main className="container"><div className="mk-skeleton" /></main>}>
      <VerifyClient />
    </Suspense>
  );
}
