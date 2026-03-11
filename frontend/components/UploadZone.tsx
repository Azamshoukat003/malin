'use client';

import { useRef, useState } from 'react';
import { formatBytes } from '@/lib/utils';

interface Props {
  file: File | null;
  onFile: (file: File) => void;
}

export function UploadZone({ file, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '60px 24px',
        textAlign: 'center',
        background: isDragging ? 'var(--color-surface-warm)' : 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/x-m4a"
        hidden
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) onFile(selected);
        }}
      />

      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
        {file ? '📄' : '☁️'}
      </div>

      <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
        {file ? 'Datei ausgewählt' : 'Datei hierher ziehen oder klicken'}
      </p>

      {!file && (
        <p className="muted" style={{ marginTop: 8 }}>
          MP3, M4A oder WAV (max. 10MB)
        </p>
      )}

      {file && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</p>
          <p className="muted" style={{ fontSize: '0.8rem' }}>{formatBytes(file.size)}</p>
        </div>
      )}
    </div>
  );
}
