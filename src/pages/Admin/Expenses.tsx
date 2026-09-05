import { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { useExpensesStore } from '@/store/expensesStore';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { formatCurrency, classNames } from '@/utils/format';
import type { ExpenseCategory } from '@/types/admin';

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  fornecedores: 'Fornecedores',
  aluguel: 'Aluguel',
  marketing: 'Marketing',
  salarios: 'Salários',
  logistica: 'Logística',
  impostos: 'Impostos',
  outros: 'Outros',
};

const EMPTY_FORM = {
  description: '',
  category: 'outros' as ExpenseCategory,
  amount: '',
  date: new Date().toISOString().slice(0, 10),
};

export default function Expenses() {
  const { expenses, addExpense, removeExpense, togglePaid, totalAmount, totalByCategory } = useExpensesStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const categoryTotals = totalByCategory();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNumber = Number(form.amount.replace(',', '.'));
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Informe um valor válido.');
      return;
    }
    addExpense({ description: form.description, category: form.category, amount: amountNumber, expenseDate: form.date, paid: false });
    setForm(EMPTY_FORM);
    setError('');
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Controle financeiro</span>
          <h1 className="mt-1 font-display text-3xl text-ink-900">Saídas</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsFormOpen((v) => !v)}>
          <Plus className="h-4 w-4" />
          Nova saída
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 border border-ink-200 bg-cream-50 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <FormField
            label="Descrição"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Ex: Compra de mercadoria"
            containerClassName="sm:col-span-2"
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-700">Categoria</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}
              className="border border-ink-300 bg-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500"
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <FormField
            label="Valor (R$)"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0,00"
            inputMode="decimal"
          />
          <FormField
            label="Data"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          {error && <p role="alert" className="text-xs text-danger sm:col-span-2 lg:col-span-4">{error}</p>}
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <Button type="submit" variant="primary" size="sm">
              Salvar saída
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Total de saídas</span>
          <p className="mt-2 font-display text-2xl text-danger">{formatCurrency(totalAmount())}</p>
        </div>
        {(Object.entries(categoryTotals) as [ExpenseCategory, number][]).slice(0, 3).map(([category, amount]) => (
          <div key={category} className="border border-ink-200 bg-cream-50 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{CATEGORY_LABELS[category]}</span>
            <p className="mt-2 font-display text-2xl text-ink-900">{formatCurrency(amount)}</p>
          </div>
        ))}
      </div>

      <div className="border border-ink-200 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Histórico de saídas</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-2xs uppercase tracking-wider text-ink-400">
                <th className="py-2 pr-4">Descrição</th>
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-ink-100">
                  <td className="py-3 pr-4 text-ink-800">{expense.description}</td>
                  <td className="py-3 pr-4 text-ink-600">{CATEGORY_LABELS[expense.category]}</td>
                  <td className="py-3 pr-4 text-ink-600">
                    {new Date(`${expense.expenseDate}T00:00:00`).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 pr-4 font-medium text-ink-900">{formatCurrency(expense.amount)}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => togglePaid(expense.id)}
                      className={classNames(
                        'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-semibold uppercase',
                        expense.paid ? 'bg-success/10 text-success' : 'bg-gold-100 text-gold-700'
                      )}
                    >
                      {expense.paid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {expense.paid ? 'Pago' : 'Pendente'}
                    </button>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => removeExpense(expense.id)}
                      aria-label={`Remover saída ${expense.description}`}
                      className="text-ink-400 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
