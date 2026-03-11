'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'mk-btn',
        variant === 'primary' && 'mk-btn-primary',
        variant === 'secondary' && 'mk-btn-secondary',
        variant === 'danger' && 'mk-btn-danger',
        className
      )}
      {...props}
    />
  );
}
