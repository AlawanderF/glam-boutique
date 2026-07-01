import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format';
import { usePaymentMethodsStore } from '@/store/paymentMethodsStore';
import type { CheckoutFormData, CheckoutStep } from '@/types/checkout';
import { SHIPPING_OPTIONS } from '@/components/checkout/StepShipping';

interface StepReviewProps {
  data: CheckoutFormData;
  total: number;
  isSubmitting: boolean;
  onEdit: (step: CheckoutStep) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function StepReview({ data, total, isSubmitting, onEdit, onBack, onConfirm }: StepReviewProps) {
  const methods = usePaymentMethodsStore((s) => s.methods);
  const selectedMethod = methods.find((m) => m.id === data.paymentMethod);
  const discountPercent = selectedMethod?.discountPercent ?? 0;
  const paymentLabel = selectedMethod
    ? `${selectedMethod.label}${discountPercent > 0 ? ` (${discountPercent}% de desconto)` : ''}`
    : data.paymentMethod;

  const shipping = SHIPPING_OPTIONS.find((s) => s.id === data.shippingMethodId);
  const finalTotal = total * (1 - discountPercent / 100);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl text-ink-900">Revise seu pedido</h2>
      <p className="text-sm text-ink-500">Confirme todas as informações antes de finalizar a compra.</p>

      <div className="rounded-sm border border-ink-200 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Identificação</p>
          <button onClick={() => onEdit('identificacao')} className="flex items-center gap-1 text-2xs text-ink-500 hover:text-ink-900">
            <Pencil className="h-3 w-3" /> Editar
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-800">{data.fullName}</p>
        <p className="text-sm text-ink-500">{data.email} · {data.phone}</p>
      </div>

      <div className="rounded-sm border border-ink-200 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Endereço de entrega</p>
          <button onClick={() => onEdit('endereco')} className="flex items-center gap-1 text-2xs text-ink-500 hover:text-ink-900">
            <Pencil className="h-3 w-3" /> Editar
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-800">
          {data.street}, {data.number} {data.complement && `- ${data.complement}`}
        </p>
        <p className="text-sm text-ink-500">
          {data.neighborhood}, {data.city} - {data.state} · CEP {data.zipCode}
        </p>
      </div>

      <div className="rounded-sm border border-ink-200 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Entrega</p>
          <button onClick={() => onEdit('entrega')} className="flex items-center gap-1 text-2xs text-ink-500 hover:text-ink-900">
            <Pencil className="h-3 w-3" /> Editar
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-800">{shipping?.label ?? 'Entrega padrão'}</p>
      </div>

      <div className="rounded-sm border border-ink-200 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Pagamento</p>
          <button onClick={() => onEdit('pagamento')} className="flex items-center gap-1 text-2xs text-ink-500 hover:text-ink-900">
            <Pencil className="h-3 w-3" /> Editar
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-800">{paymentLabel}</p>
        {data.paymentMethod === 'cartao' && (
          <p className="text-sm text-ink-500">
            {data.installments}x de {formatCurrency(total / data.installments)}
          </p>
        )}
      </div>

      <div className="flex items-baseline justify-between rounded-sm bg-ink-50/60 px-5 py-4">
        <span className="font-display text-lg text-ink-900">Total a pagar</span>
        <span className="font-display text-2xl text-ink-900">{formatCurrency(finalTotal)}</span>
      </div>

      <div className="mt-2 flex justify-between">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          Voltar
        </Button>
        <Button variant="gold" onClick={onConfirm} isLoading={isSubmitting}>
          {isSubmitting ? 'Confirmando pedido...' : 'Confirmar e finalizar compra'}
        </Button>
      </div>
    </div>
  );
}
