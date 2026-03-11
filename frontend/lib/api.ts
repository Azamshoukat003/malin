const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getApiUrl = () => {
  if (!API_URL && typeof window !== 'undefined') {
    console.error('NEXT_PUBLIC_API_URL is missing');
  }
  return API_URL;
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

const REFRESH_PATH = '/api/auth/refresh';
const REFRESH_BLOCKLIST = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/request-magic-link',
  '/api/auth/forgot-password/request-otp',
  '/api/auth/forgot-password/verify-otp',
  '/api/auth/forgot-password/reset',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/admin/login'
]);

const fetchApi = async <T>(path: string, init?: RequestInit): Promise<{ res: Response; payload: ApiResponse<T> }> => {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
  const payload = (await res.json()) as ApiResponse<T>;
  return { res, payload };
};

const tryRefreshSession = async (): Promise<boolean> => {
  try {
    const { res, payload } = await fetchApi<{ refreshed: boolean }>(REFRESH_PATH, { method: 'POST' });
    return res.ok && payload.success;
  } catch {
    return false;
  }
};

export const apiFetch = async <T>(path: string, init?: RequestInit, retry = true): Promise<T> => {
  const { res, payload } = await fetchApi<T>(path, init);

  if (res.status === 401 && retry && !REFRESH_BLOCKLIST.has(path)) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return apiFetch<T>(path, init, false);
    }
  }

  if (!res.ok || !payload.success) {
    throw new Error(payload.error ?? 'Unbekannter Fehler');
  }
  return payload.data;
};
