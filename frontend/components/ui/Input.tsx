import { useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type, ...props }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (show ? 'text' : 'password') : type;

  if (!isPassword) {
    return <input type={type} className={cn('mk-input', className)} {...props} />;
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={actualType}
        className={cn('mk-input', className)}
        style={{ paddingRight: '48px' }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        tabIndex={-1}
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s'
        }}
        className="mk-input-eye"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
