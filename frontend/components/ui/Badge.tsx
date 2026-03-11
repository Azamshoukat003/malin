import { cn } from '@/lib/utils';

interface Props {
  children: string;
  tone?: 'success' | 'muted' | 'accent';
}

export function Badge({ children, tone = 'muted' }: Props) {
  return (
    <span
      className={cn(
        'mk-badge',
        tone === 'success' && 'mk-badge-success',
        tone === 'accent' && 'mk-badge-accent'
      )}
    >
      {children}
    </span>
  );
}
