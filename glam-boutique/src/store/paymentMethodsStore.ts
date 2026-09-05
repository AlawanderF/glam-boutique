import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminPaymentMethodConfig } from '@/types/admin';

interface PaymentMethodsState {
  methods: AdminPaymentMethodConfig[];
  addMethod: (method: Omit<AdminPaymentMethodConfig, 'id' | 'isCustom'>) => void;
  updateMethod: (id: string, data: Partial<AdminPaymentMethodConfig>) => void;
  removeMethod: (id: string) => void;
  toggleEnabled: (id: string) => void;
}

const defaultMethods: AdminPaymentMethodConfig[] = [
  { id: 'pix', label: 'Pix', enabled: true, discountPercent: 5 },
  { id: 'cartao', label: 'Cartão de crédito', enabled: true, maxInstallments: 10 },
  { id: 'boleto', label: 'Boleto bancário', enabled: true },
  { id: 'carteira', label: 'Carteiras digitais', enabled: true },
];

export const usePaymentMethodsStore = create<PaymentMethodsState>()(
  persist(
    (set) => ({
      methods: defaultMethods,
      addMethod: (method) =>
        set((state) => ({
          methods: [...state.methods, { ...method, id: `custom-${Date.now()}`, isCustom: true }],
        })),
      updateMethod: (id, data) =>
        set((state) => ({
          methods: state.methods.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),
      removeMethod: (id) => set((state) => ({ methods: state.methods.filter((m) => m.id !== id) })),
      toggleEnabled: (id) =>
        set((state) => ({
          methods: state.methods.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
        })),
    }),
    { name: 'glam-boutique-payment-methods' }
  )
);
