import { createContext, useCallback, useContext } from 'react';
import type { AuthUser } from '../types';
import { API } from '../constants';

export type AuthCtx = {
  user: AuthUser | null;
  token: string | null;
  login: (u: AuthUser, t: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
};

export const useApi = () => {
  const { token, logout } = useAuth();
  return useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API}${path}`, { ...options, headers });
    if (res.status === 401) { logout(); throw new Error('Sessão expirada'); }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail ?? body.message ?? 'Erro no servidor');
    }
    if (res.status === 204) return null as T;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json() as Promise<T>;
    return null as T;
  }, [token, logout]);
};
