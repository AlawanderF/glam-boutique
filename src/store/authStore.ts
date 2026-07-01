import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (name: string, email: string, _password: string) => Promise<{ success: boolean; message?: string }>;
  updateUser: (data: Partial<Omit<User, 'id'>>) => void;
  logout: () => void;
}

// Mock de autenticação — substituir por chamadas reais ao backend/services/authService.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email) => {
        await new Promise((r) => setTimeout(r, 700));
        set({
          user: { id: 'usr-1', name: email.split('@')[0], email },
          isAuthenticated: true,
        });
        return { success: true };
      },
      registerUser: async (name, email) => {
        await new Promise((r) => setTimeout(r, 700));
        set({ user: { id: 'usr-1', name, email }, isAuthenticated: true });
        return { success: true };
      },
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : state.user,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'glam-boutique-auth' }
  )
);
