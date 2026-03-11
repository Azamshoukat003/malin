'use client';

import { useAudio } from '@/hooks/useAudio';
import { formatDuration } from '@/lib/utils';
import { WaveformBars } from './WaveformBars';
import { Play, Pause, Volume2 } from 'lucide-react';

interface Props {
  src: string;
}

export function AudioPlayer({ src }: Props) {
  const { audioRef, playing, currentTime, duration, volume, toggle, seek, setVol } = useAudio(src);

  return (
    <div
      className="mk-player-card"
      style={{
        background: 'var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'min(32px, 6vw)',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      <audio ref={audioRef} src={src} preload="metadata" playsInline />

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => void toggle()}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-primary)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            flexShrink: 0
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          className="mk-play-button"
        >
          {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.8 }}>
            <span>Wiedergabe</span>
            <span className="mono">{formatDuration(currentTime)} / {formatDuration(duration)}</span>
          </div>
          <WaveformBars playing={playing} />
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={0}
          max={Math.max(duration, 1)}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--color-accent)',
            cursor: 'pointer'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
        <Volume2 size={18} style={{ opacity: 0.7 }} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVol(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'white', opacity: 0.4 }}
        />
      </div>
    </div>
  );
}
