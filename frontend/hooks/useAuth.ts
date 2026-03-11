'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface AuthMe {
  userId: string;
  email: string;
  childName: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const me = await apiFetch<AuthMe>('/api/auth/me');
        setUser(me);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return { user, loading, error };
};
