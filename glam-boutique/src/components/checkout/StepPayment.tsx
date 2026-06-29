import { useMemo } from 'react';
import { QrCode, CreditCard, Barcode, Wallet, Landmark, type LucideIcon } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format';
import { classNames } from '@/utils/format';
import { usePaymentMethodsStore } from '@/store/paymentMethodsStore';
import type { CheckoutFormData } from '@/types/checkout';

interface StepPaymentProps {
  data: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  total: number;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ICONS_BY_ID: Record<string, LucideIcon> = {
  pix: QrCode,
  cartao: CreditCard,
  boleto: Barcode,
  carteira: Wallet,
};

export function StepPayment({ data, errors, total, onChange, onNext, onBack }: StepPaymentProps) {
  const allMethods = usePaymentMethodsStore((s) => s.methods);
  const enabledMethods = useMemo(() => allMethods.filter((m) => m.enabled), [allMethods]);
  const activeMethod = enabledMethods.find((m) => m.id === data.paymentMethod) ?? enabledMethods[0];

  const pixMethod = enabledMethods.find((m) => m.id === 'pix');
  const cardMethod = enabledMethods.find((m) => m.id === 'cartao');
  const maxInstallments = cardMethod?.maxInstallments ?? 10;
  const pixDiscount = (pixMethod?.discountPercent ?? 0) / 100;

  if (enabledMethods.length === 0) {
    return (
      <div className="rounded-sm border border-ink-200 bg-ink-50/50 p-6 text-center text-sm text-ink-600">
        Nenhum método de pagamento está disponível no momento. Entre em contato com a loja para finalizar sua compra.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl text-ink-900">Pagamento</h2>
      <p className="text-sm text-ink-500">Escolha a forma de pagamento mais conveniente para você.</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {enabledMethods.map((method) => {
          const Icon = ICONS_BY_ID[method.id] ?? Landmark;
          const tag = method.discountPercent
            ? `${method.discountPercent}% de desconto`
            : method.maxInstallments
            ? `até ${method.maxInstallments}x sem juros`
            : undefined;
          const isActive = activeMethod?.id === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange('paymentMethod', method.id)}
              aria-pressed={isActive}
              className={classNames(
                'flex flex-col items-center gap-2 rounded-sm border px-3 py-4 text-center transition-colors',
                isActive ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-ink-300 text-ink-700 hover:border-ink-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{method.label}</span>
              {tag && <span className={classNames('text-2xs', isActive ? 'text-gold-300' : 'text-gold-600')}>{tag}</span>}
            </button>
          );
        })}
      </div>

      {/* Pix */}
      {activeMethod?.id === 'pix' && (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-200 bg-ink-50/50 p-6 text-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-sm bg-cream-50 shadow-soft">
            <QrCode className="h-24 w-24 text-ink-800" aria-hidden="true" />
          </div>
          <p className="text-sm text-ink-600">
            O QR Code Pix será gerado após a confirmação do pedido
            {pixDiscount > 0 && (
              <>
                , com <strong className="text-success">{pixMethod?.discountPercent}% de desconto</strong> aplicado
                automaticamente
              </>
            )}
            .
          </p>
          <p className="font-display text-lg text-ink-900">{formatCurrency(total * (1 - pixDiscount))}</p>
        </div>
      )}

      {/* Cartão */}
      {activeMethod?.id === 'cartao' && (
        <div className="flex flex-col gap-5 rounded-sm border border-ink-200 p-6">
          <FormField
            label="Número do cartão"
            name="cardNumber"
            value={data.cardNumber}
            onChange={(e) => onChange('cardNumber', e.target.value)}
            error={errors.cardNumber}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
          />
          <FormField
            label="Nome impresso no cartão"
            name="cardName"
            value={data.cardName}
            onChange={(e) => onChange('cardName', e.target.value)}
            error={errors.cardName}
            placeholder="Como está no cartão"
          />
          <div className="grid grid-cols-2 gap-5">
            <FormField
              label="Validade"
              name="cardExpiry"
              value={data.cardExpiry}
              onChange={(e) => onChange('cardExpiry', e.target.value)}
              error={errors.cardExpiry}
              placeholder="MM/AA"
            />
            <FormField
              label="CVV"
              name="cardCvv"
              value={data.cardCvv}
              onChange={(e) => onChange('cardCvv', e.target.value)}
              error={errors.cardCvv}
              placeholder="000"
              inputMode="numeric"
            />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-700">Parcelas</span>
            <select
              value={data.installments}
              onChange={(e) => onChange('installments', e.target.value)}
              className="border border-ink-300 bg-cream-50 px-4 py-3 text-sm focus:outline-none focus:border-gold-500"
            >
              {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}x de {formatCurrency(total / n)} {n === 1 ? '(à vista)' : 'sem juros'}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Boleto */}
      {activeMethod?.id === 'boleto' && (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-200 bg-ink-50/50 p-6 text-center">
          <Barcode className="h-16 w-32 text-ink-800" aria-hidden="true" />
          <p className="text-sm text-ink-600">
            O boleto será gerado após a confirmação e enviado para o seu e-mail. Vencimento em 3 dias úteis.
          </p>
          <p className="font-display text-lg text-ink-900">{formatCurrency(total)}</p>
        </div>
      )}

      {/* Carteiras digitais ou métodos customizados */}
      {activeMethod && activeMethod.id !== 'pix' && activeMethod.id !== 'cartao' && activeMethod.id !== 'boleto' && (
        <div className="flex flex-col gap-3 rounded-sm border border-ink-200 p-6">
          <p className="text-sm text-ink-600">
            {activeMethod.id === 'carteira'
              ? 'Escolha sua carteira digital preferida para concluir o pagamento:'
              : `Pagamento via ${activeMethod.label} será confirmado manualmente pela loja.`}
          </p>
          {activeMethod.id === 'carteira' && (
            <div className="flex flex-wrap gap-3">
              {['Apple Pay', 'Google Pay', 'PayPal', 'Mercado Pago'].map((wallet) => (
                <button
                  key={wallet}
                  type="button"
                  className="rounded-sm border border-ink-300 px-5 py-3 text-sm font-medium text-ink-700 hover:border-ink-900"
                >
                  {wallet}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-2 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="primary" onClick={onNext}>
          Revisar pedido
        </Button>
      </div>
    </div>
  );
}

