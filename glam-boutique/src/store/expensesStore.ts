import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, ExpenseCategory } from '@/types/admin';

interface ExpensesState {
  expenses: Expense[];
  addExpense: (data: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  togglePaid: (id: string) => void;
  totalByCategory: () => Record<ExpenseCategory, number>;
  totalAmount: () => number;
}

const seedExpenses: Expense[] = [
  { id: 'exp-1', description: 'Aluguel da loja - Centro, Guarabira', category: 'aluguel', amount: 2200, date: '2026-06-05', paid: true },
  { id: 'exp-2', description: 'Compra de mercadoria - coleção inverno', category: 'fornecedores', amount: 8450, date: '2026-06-08', paid: true },
  { id: 'exp-3', description: 'Campanha de tráfego pago - Instagram', category: 'marketing', amount: 950, date: '2026-06-10', paid: true },
  { id: 'exp-4', description: 'Folha de pagamento - equipe de vendas', category: 'salarios', amount: 4300, date: '2026-06-05', paid: true },
  { id: 'exp-5', description: 'Frete de reposição de estoque', category: 'logistica', amount: 620, date: '2026-06-15', paid: false },
  { id: 'exp-6', description: 'DAS - Simples Nacional', category: 'impostos', amount: 780, date: '2026-06-20', paid: false },
];

export const useExpensesStore = create<ExpensesState>()(
  persist(
    (set, get) => ({
      expenses: seedExpenses,
      addExpense: (data) =>
        set((state) => ({
          expenses: [{ ...data, id: `exp-${Date.now()}` }, ...state.expenses],
        })),
      removeExpense: (id) => set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
      togglePaid: (id) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, paid: !e.paid } : e)),
        })),
      totalByCategory: () => {
        const totals = {} as Record<ExpenseCategory, number>;
        for (const expense of get().expenses) {
          totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
        }
        return totals;
      },
      totalAmount: () => get().expenses.reduce((sum, e) => sum + e.amount, 0),
    }),
    { name: 'glam-boutique-expenses' }
  )
);
