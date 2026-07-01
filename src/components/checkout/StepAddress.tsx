import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import type { CheckoutFormData } from '@/types/checkout';

interface StepProps {
  data: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAddress({ data, errors, onChange, onNext, onBack }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl text-ink-900">Endereço de entrega</h2>
      <p className="text-sm text-ink-500">Para onde devemos enviar seu pedido?</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <FormField
          label="CEP"
          name="zipCode"
          value={data.zipCode}
          onChange={(e) => onChange('zipCode', e.target.value)}
          error={errors.zipCode}
          placeholder="58200-000"
        />
        <FormField
          label="Cidade"
          name="city"
          value={data.city}
          onChange={(e) => onChange('city', e.target.value)}
          error={errors.city}
          placeholder="Guarabira"
          containerClassName="sm:col-span-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[2fr_1fr]">
        <FormField
          label="Rua"
          name="street"
          value={data.street}
          onChange={(e) => onChange('street', e.target.value)}
          error={errors.street}
          placeholder="Rua Quinze de Novembro"
        />
        <FormField
          label="Número"
          name="number"
          value={data.number}
          onChange={(e) => onChange('number', e.target.value)}
          error={errors.number}
          placeholder="100"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Complemento (opcional)"
          name="complement"
          value={data.complement}
          onChange={(e) => onChange('complement', e.target.value)}
          placeholder="Sala, apto, bloco..."
        />
        <FormField
          label="Bairro"
          name="neighborhood"
          value={data.neighborhood}
          onChange={(e) => onChange('neighborhood', e.target.value)}
          error={errors.neighborhood}
          placeholder="Centro"
        />
      </div>

      <FormField
        label="Estado"
        name="state"
        value={data.state}
        onChange={(e) => onChange('state', e.target.value)}
        error={errors.state}
        placeholder="PB"
        containerClassName="max-w-[120px]"
        maxLength={2}
      />

      <div className="mt-2 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="primary" onClick={onNext}>
          Continuar para entrega
        </Button>
      </div>
    </div>
  );
}
