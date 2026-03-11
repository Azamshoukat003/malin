'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'mk-toast',
        style: {
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-body)',
        },
      }}
      closeButton
      richColors
    />
  );
}
