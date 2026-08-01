import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest, isBackendConfigured } from '@/services/api';

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
          return { success: false, message: 'Backend não configurado. Configure VITE_API_URL no frontend.' };
        }

        try {
          const result = await apiRequest<{ token: string }>('/api/admin/login', {
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
            message: error instanceof Error ? error.message : 'Não foi possível entrar.',
          };
        }
      },

      logout: () => set({ isAdminAuthenticated: false, adminName: null, token: null }),
    }),
    { name: 'glam-boutique-admin-auth' }
  )
);
