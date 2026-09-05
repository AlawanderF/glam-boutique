import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function isBackendConfigured(): boolean {
  return Boolean(API_URL && API_URL.trim().length > 0);
}

export type AdminAuthMode = 'backend' | 'demo';

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  adminName: string | null;
  mode: AdminAuthMode;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  verifySession: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()((set, get) => ({
  isAdminAuthenticated: false,
  adminName: null,
  mode: isBackendConfigured() ? 'backend' : 'demo',

  login: async (email, password) => {
    if (!isBackendConfigured()) {
      return { success: false, message: 'Backend não configurado.' };
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies in the request
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error ?? 'Erro ao fazer login.' };
      }

      set({
        isAdminAuthenticated: true,
        adminName: 'Administrador(a) Glam Boutique',
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

  logout: async () => {
    if (isBackendConfigured() && API_URL) {
      try {
        await fetch(`${API_URL}/api/admin/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        // Ignore logout errors - we still want to clear local state
      }
    }
    set({ isAdminAuthenticated: false, adminName: null });
  },

  verifySession: async (): Promise<boolean> => {
    if (!isBackendConfigured() || !API_URL) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        credentials: 'include',
      });

      if (!response.ok) {
        set({ isAdminAuthenticated: false, adminName: null });
        return false;
      }

      const data = await response.json();
      if (data.valid) {
        set({
          isAdminAuthenticated: true,
          adminName: 'Administrador(a) Glam Boutique',
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  checkAuth: async () => {
    if (!isBackendConfigured()) {
      return;
    }

    const isValid = await get().verifySession();
    if (!isValid && get().isAdminAuthenticated) {
      set({ isAdminAuthenticated: false, adminName: null });
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login?expired=true';
      }
    }
  },
}));

// Check for expired session on load (for pages that don't use the layout)
if (typeof window !== 'undefined' && isBackendConfigured()) {
  // Run on admin routes only
  if (window.location.pathname.startsWith('/admin')) {
    useAdminAuthStore.getState().checkAuth();
  }
}
