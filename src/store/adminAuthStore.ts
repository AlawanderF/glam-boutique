import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function decodeToken(token: string): { exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp * 1000 > Date.now();
}

function isBackendConfigured(): boolean {
  return Boolean(API_URL && API_URL.trim().length > 0);
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = useAdminAuthStore.getState().token;
  if (!token) return {};
  return { 'Authorization': `Bearer ${token}` };
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_URL não configurada.');
  }

  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro na requisição (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export type AdminAuthMode = 'backend' | 'demo';

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  adminName: string | null;
  token: string | null;
  mode: AdminAuthMode;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isValid: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      adminName: null,
      token: null,
      mode: isBackendConfigured() ? 'backend' : 'demo',

      login: async (email, password) => {
        if (!isBackendConfigured()) {
          return { success: false, message: 'Backend não configurado.' };
        }

        try {
          const result = await apiRequest<{ token: string }>('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          set({
            isAdminAuthenticated: true,
            adminName: 'Administrador(a) Glam Boutique',
            token: result.token,
            mode: 'backend',
          });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao fazer login.',
          };
        }
      },

      logout: () => set({ isAdminAuthenticated: false, adminName: null, token: null }),

      isValid: () => {
        const { token, isAdminAuthenticated } = get();
        if (!isAdminAuthenticated || !token) return false;
        return isTokenValid(token);
      },
    }),
    { name: 'glam-boutique-admin-auth' }
  )
);

// Verificar token expirado periodicamente
const token = useAdminAuthStore.getState().token;
if (token && !isTokenValid(token)) {
  useAdminAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login?expired=true';
  }
}
