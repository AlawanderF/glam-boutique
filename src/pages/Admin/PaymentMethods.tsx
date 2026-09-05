import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { usePaymentMethodsStore } from '@/store/paymentMethodsStore';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { classNames } from '@/utils/format';

const EMPTY_FORM = { label: '', discountPercent: '', maxInstallments: '' };

export default function PaymentMethods() {
  const { methods, addMethod, updateMethod, removeMethod, toggleEnabled } = usePaymentMethodsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [editingDiscount, setEditingDiscount] = useState<{ id: string; value: string } | null>(null);

  const handleDiscountUpdate = async (id: string, discount: number) => {
    updateMethod(id, { discountPercent: discount || undefined });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) {
      setError('Informe o nome do método de pagamento.');
      return;
    }
    addMethod({
      label: form.label.trim(),
      enabled: true,
      discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
      maxInstallments: form.maxInstallments ? Number(form.maxInstallments) : undefined,
    });
    setForm(EMPTY_FORM);
    setError('');
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Checkout</span>
          <h1 className="mt-1 font-display text-3xl text-ink-900">Métodos de pagamento</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-500">
            Ative, desative ou adicione formas de pagamento. As alterações refletem imediatamente na etapa de
            pagamento do checkout da loja.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsFormOpen((v) => !v)}>
          <Plus className="h-4 w-4" />
          Novo método
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 border border-ink-200 bg-cream-50 p-6 sm:grid-cols-3">
          <FormField
            label="Nome do método"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="Ex: Transferência bancária"
          />
          <FormField
            label="Desconto (%) — opcional"
            value={form.discountPercent}
            onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
            placeholder="Ex: 5"
            inputMode="numeric"
          />
          <FormField
            label="Parcelas máx. — opcional"
            value={form.maxInstallments}
            onChange={(e) => setForm((f) => ({ ...f, maxInstallments: e.target.value }))}
            placeholder="Ex: 3"
            inputMode="numeric"
          />
          {error && <p role="alert" className="text-xs text-danger sm:col-span-3">{error}</p>}
          <div className="flex items-end gap-2 sm:col-span-3">
            <Button type="submit" variant="primary" size="sm">
              Adicionar método
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex flex-wrap items-center justify-between gap-4 border border-ink-200 bg-cream-50 p-5"
          >
            <div>
              <p className="font-medium text-ink-900">{method.label}</p>
              <p className="mt-0.5 text-xs text-ink-500">
                {method.discountPercent ? `${method.discountPercent}% de desconto` : null}
                {method.discountPercent && method.maxInstallments ? ' · ' : null}
                {method.maxInstallments ? `até ${method.maxInstallments}x sem juros` : null}
                {!method.discountPercent && !method.maxInstallments ? 'Sem condições especiais' : null}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-ink-600">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={() => toggleEnabled(method.id)}
                  className="h-4 w-4 text-ink-900 focus:ring-gold-500"
                />
                Ativo
              </label>
              <button
                type="button"
                onClick={() => setEditingDiscount({ id: method.id, value: String(method.discountPercent ?? '') })}
                className="link-underline text-2xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900"
              >
                Editar desconto
              </button>
              {method.isCustom && (
                <button
                  onClick={() => removeMethod(method.id)}
                  aria-label={`Remover ${method.label}`}
                  className={classNames('text-ink-400 hover:text-danger')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingDiscount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Editar Desconto</h3>
            <input
              type="number"
              value={editingDiscount.value}
              onChange={(e) => setEditingDiscount({ ...editingDiscount, value: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
              min="0"
              max="100"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingDiscount(null)} className="px-4 py-2 text-gray-600">
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDiscountUpdate(editingDiscount.id, Number(editingDiscount.value));
                  setEditingDiscount(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
