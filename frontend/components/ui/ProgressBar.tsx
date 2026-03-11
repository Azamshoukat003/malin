interface Props {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: Props) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100));
  return (
    <div className="mk-progress">
      <div className="mk-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
