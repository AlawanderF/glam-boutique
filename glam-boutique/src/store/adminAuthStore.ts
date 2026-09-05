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

// Credenciais usadas APENAS quando o backend (server/) não está configurado —
// modo de demonstração para testar a interface sem precisar do MySQL.
// Nunca confie nesse caminho em produção: configure VITE_API_URL e o backend real.
const DEMO_ADMIN_EMAIL = 'admin@glamboutique.com.br';
const DEMO_ADMIN_PASSWORD = 'glamadmin123';

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminName: null,
      token: null,
      mode: isBackendConfigured() ? 'backend' : 'demo',

      login: async (email, password) => {
        if (isBackendConfigured()) {
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
              message: error instanceof Error ? error.message : 'Não foi possível entrar.',
            };
          }
        }

        // Fallback de demonstração (sem backend configurado)
        await new Promise((r) => setTimeout(r, 600));
        if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
          set({
            isAdminAuthenticated: true,
            adminName: 'Administrador(a) Glam Boutique (demonstração)',
            token: null,
            mode: 'demo',
          });
          return { success: true };
        }
        return { success: false, message: 'E-mail ou senha de administrador incorretos.' };
      },

      logout: () => set({ isAdminAuthenticated: false, adminName: null, token: null }),
    }),
    { name: 'glam-boutique-admin-auth' }
  )
);
