import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  Icon?: LucideIcon;
}

export function AdminStatsCard({ label, value, Icon }: Props) {
  return (
    <article className="mk-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p className="muted" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          {label}
        </p>
        <span className="mk-stat-value">
          {value}
        </span>
      </div>
      {Icon && (
        <div style={{ color: 'var(--color-accent)', padding: '12px', background: 'var(--color-accent-light)', borderRadius: '16px' }}>
          <Icon size={24} />
        </div>
      )}
    </article>
  );
}
