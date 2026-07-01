import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import type { CheckoutFormData } from '@/types/checkout';

interface StepProps {
  data: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onNext: () => void;
}

export function StepIdentification({ data, errors, onChange, onNext }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl text-ink-900">Identificação</h2>
      <p className="text-sm text-ink-500">Informe seus dados para que possamos confirmar seu pedido.</p>

      <FormField
        label="Nome completo"
        name="fullName"
        autoComplete="name"
        value={data.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        error={errors.fullName}
        placeholder="Seu nome completo"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
          placeholder="seuemail@exemplo.com"
        />
        <FormField
          label="Telefone / WhatsApp"
          name="phone"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="(83) 99999-0000"
        />
      </div>
      <FormField
        label="CPF"
        name="cpf"
        value={data.cpf}
        onChange={(e) => onChange('cpf', e.target.value)}
        error={errors.cpf}
        placeholder="000.000.000-00"
        containerClassName="max-w-xs"
      />

      <div className="mt-2 flex justify-end">
        <Button variant="primary" onClick={onNext}>
          Continuar para endereço
        </Button>
      </div>
    </div>
  );
}
