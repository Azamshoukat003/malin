import { cn } from '@/lib/utils';

interface Props {
  playing: boolean;
}

export function WaveformBars({ playing }: Props) {
  return (
    <div className={cn('mk-waveform', playing && 'is-playing')}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.04}s` }} />
      ))}
    </div>
  );
}
