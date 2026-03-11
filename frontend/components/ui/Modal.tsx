'use client';

import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="mk-modal-backdrop" onClick={onClose} role="presentation">
      <div className="mk-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
