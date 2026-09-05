import { describe, it, expect, beforeEach } from 'vitest';
import { useExpensesStore } from './expensesStore';

describe('expensesStore', () => {
  beforeEach(() => {
    useExpensesStore.setState({ expenses: [] });
  });

  it('adiciona expense', () => {
    useExpensesStore.getState().addExpense({
      description: 'Teste',
      category: 'outros',
      amount: 100,
      expenseDate: '2026-01-01',
      paid: false,
    });
    expect(useExpensesStore.getState().expenses).toHaveLength(1);
    expect(useExpensesStore.getState().expenses[0].description).toBe('Teste');
  });

  it('remove expense por id', () => {
    useExpensesStore.getState().addExpense({
      description: 'X',
      category: 'outros',
      amount: 50,
      expenseDate: '2026-01-01',
      paid: false,
    });
    const id = useExpensesStore.getState().expenses[0].id;
    useExpensesStore.getState().removeExpense(id);
    expect(useExpensesStore.getState().expenses).toHaveLength(0);
  });

  it('togglePaid inverte estado paid', () => {
    useExpensesStore.getState().addExpense({
      description: 'Y',
      category: 'outros',
      amount: 50,
      expenseDate: '2026-01-01',
      paid: false,
    });
    const id = useExpensesStore.getState().expenses[0].id;
    useExpensesStore.getState().togglePaid(id);
    expect(useExpensesStore.getState().expenses[0].paid).toBe(true);
    useExpensesStore.getState().togglePaid(id);
    expect(useExpensesStore.getState().expenses[0].paid).toBe(false);
  });

  it('totalAmount soma corretamente', () => {
    useExpensesStore.getState().addExpense({
      description: 'A',
      category: 'fornecedores',
      amount: 100,
      expenseDate: '2026-01-01',
      paid: true,
    });
    useExpensesStore.getState().addExpense({
      description: 'B',
      category: 'marketing',
      amount: 200,
      expenseDate: '2026-01-02',
      paid: true,
    });
    expect(useExpensesStore.getState().totalAmount()).toBe(300);
  });

  it('totalByCategory agrupa por categoria', () => {
    useExpensesStore.getState().addExpense({
      description: 'A1',
      category: 'fornecedores',
      amount: 100,
      expenseDate: '2026-01-01',
      paid: true,
    });
    useExpensesStore.getState().addExpense({
      description: 'A2',
      category: 'fornecedores',
      amount: 50,
      expenseDate: '2026-01-02',
      paid: true,
    });
    useExpensesStore.getState().addExpense({
      description: 'B1',
      category: 'marketing',
      amount: 200,
      expenseDate: '2026-01-03',
      paid: false,
    });
    const totals = useExpensesStore.getState().totalByCategory();
    expect(totals.fornecedores).toBe(150);
    expect(totals.marketing).toBe(200);
  });
});
