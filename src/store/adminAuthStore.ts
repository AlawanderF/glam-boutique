import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function isBackendConfigured(): boolean {
  return Boolean(API_URL && API_URL.trim().length > 0);
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_URL não configurada.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
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
    }),
    { name: 'glam-boutique-admin-auth' }
  )
);
