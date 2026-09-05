import { Button } from '@/components/ui/Button';
import { formatCurrency, estimateDeliveryDate } from '@/utils/format';
import { FREE_SHIPPING_THRESHOLD } from '@/constants';

interface ShippingOption {
  id: string;
  label: string;
  days: number;
  price: number;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', label: 'Entrega padrão', days: 8, price: 19.9 },
  { id: 'express', label: 'Entrega expressa', days: 3, price: 39.9 },
  { id: 'pickup', label: 'Retirar na loja (Guarabira - PB)', days: 1, price: 0 },
];

interface StepShippingProps {
  shippingMethodId: string;
  subtotal: number;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepShipping({ shippingMethodId, subtotal, onSelect, onNext, onBack }: StepShippingProps) {
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl text-ink-900">Opções de entrega</h2>
      <p className="text-sm text-ink-500">Escolha como deseja receber o seu pedido.</p>

      <div className="flex flex-col gap-3">
        {SHIPPING_OPTIONS.map((option) => {
          const price = option.id !== 'pickup' && freeShipping ? 0 : option.price;
          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-center justify-between rounded-sm border border-ink-200 px-5 py-4 text-sm transition-colors hover:border-ink-400"
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethodId === option.id}
                  onChange={() => onSelect(option.id)}
                  className="text-ink-900 focus:ring-gold-500"
                />
                <span>
                  <span className="block font-medium text-ink-900">{option.label}</span>
                  <span className="text-xs text-ink-500">
                    Chegada estimada até {estimateDeliveryDate(option.days)}
                  </span>
                </span>
              </span>
              <span className="font-semibold text-ink-900">
                {price === 0 ? 'Grátis' : formatCurrency(price)}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="primary" onClick={onNext}>
          Continuar para pagamento
        </Button>
      </div>
    </div>
  );
}

export { SHIPPING_OPTIONS };
