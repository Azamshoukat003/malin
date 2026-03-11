'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { UploadZone } from '@/components/UploadZone';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Navbar } from '@/components/Navbar';

interface ExistingPlay {
  audio: { presignedUrl: string } | null;
  yearLabel: number | null;
}

export default function UploadClient() {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingAudioUrl, setExistingAudioUrl] = useState<string | null>(null);
  const [yearLabel, setYearLabel] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await apiFetch<ExistingPlay | null>(`/api/play/${code}`);
        setExistingAudioUrl(data?.audio?.presignedUrl ?? null);
        setYearLabel(data?.yearLabel ?? null);
      } catch {
        setExistingAudioUrl(null);
      }
    };
    void run();
  }, [code]);

  const fileDuration = useMemo(
    () =>
      file
        ? new Promise<number>((resolve) => {
          const audio = document.createElement('audio');
          audio.preload = 'metadata';
          audio.onloadedmetadata = () => resolve(audio.duration || 0);
          audio.src = URL.createObjectURL(file);
        })
        : Promise.resolve(0),
    [file]
  );

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const durationSeconds = Math.round(await fileDuration);
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('qrCode', code);
      if (durationSeconds) {
        formData.append('durationSeconds', durationSeconds.toString());
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/upload/direct`);
      xhr.withCredentials = true;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.error || 'Upload fehlgeschlagen'));
            } catch {
              reject(new Error('Upload fehlgeschlagen'));
            }
          }
        };
        xhr.onerror = () => reject(new Error('Netzwerkfehler beim Upload'));
        xhr.send(formData);
      });

      router.push(`/upload/success?code=${encodeURIComponent(code)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Upload');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    await apiFetch(`/api/upload/${code}`, { method: 'DELETE' });
    setExistingAudioUrl(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar variant="dashboard" onLogout={() => router.push('/login')} />

      <main className="container animate-fade-up" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)' }}>Jahr {yearLabel ?? '-'} hinzufügen</h1>
            <p className="muted">Wähle eine Audiodatei aus deinem Speicher aus (Max. 10MB).</p>
          </header>

          <div className="mk-grid-2">
            <article className="mk-card">
              <h3 style={{ marginBottom: '16px' }}>Datei hochladen</h3>
              <UploadZone file={file} onFile={setFile} />

              {progress > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <p className="mk-label">Wird hochgeladen... {progress}%</p>
                  <ProgressBar value={progress} max={100} />
                </div>
              )}

              {error && <p className="mk-error" style={{ marginTop: '16px' }}>{error}</p>}

              <div style={{ marginTop: '24px' }}>
                <Button
                  onClick={() => void onSubmit()}
                  disabled={!file || loading}
                  style={{ width: '100%', height: '54px' }}
                >
                  {loading ? 'Speichere...' : 'Erinnerung speichern'}
                </Button>
              </div>
            </article>

            <article className="mk-card" style={{ background: 'var(--color-surface-warm)' }}>
              <h3 style={{ marginBottom: '16px' }}>Vorschau / Aktuell</h3>
              {!existingAudioUrl ? (
                <div className="text-center" style={{ padding: '40px 0' }}>
                  <p className="muted">Noch keine Aufnahme vorhanden.</p>
                </div>
              ) : (
                <div>
                  <AudioPlayer src={existingAudioUrl} />
                  <div style={{ marginTop: '24px' }}>
                    <Button
                      variant="danger"
                      onClick={() => void onDelete()}
                      style={{ width: '100%' }}
                    >
                      Aufnahme löschen
                    </Button>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}

