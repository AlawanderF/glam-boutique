import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { StepIdentification } from '@/components/checkout/StepIdentification';
import { StepAddress } from '@/components/checkout/StepAddress';
import { StepShipping, SHIPPING_OPTIONS } from '@/components/checkout/StepShipping';
import { StepPayment } from '@/components/checkout/StepPayment';
import { StepReview } from '@/components/checkout/StepReview';
import { OrderSummarySidebar } from '@/components/checkout/OrderSummarySidebar';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { EMPTY_CHECKOUT_FORM, type CheckoutFormData, type CheckoutStep } from '@/types/checkout';
import { ROUTES, FREE_SHIPPING_THRESHOLD } from '@/constants';

const STEP_ORDER: CheckoutStep[] = ['identificacao', 'endereco', 'entrega', 'pagamento', 'revisao'];

export default function Checkout() {
  const { items, subtotal, discountAmount, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('identificacao');
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [formData, setFormData] = useState<CheckoutFormData>(EMPTY_CHECKOUT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'installments' ? Number(value) : value,
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (current: CheckoutStep): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (current === 'identificacao') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Informe seu nome completo.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido.';
      if (!formData.phone.trim()) newErrors.phone = 'Informe um telefone de contato.';
      if (formData.cpf.replace(/\D/g, '').length < 11) newErrors.cpf = 'CPF inválido.';
    }

    if (current === 'endereco') {
      if (formData.zipCode.replace(/\D/g, '').length < 8) newErrors.zipCode = 'CEP inválido.';
      if (!formData.street.trim()) newErrors.street = 'Informe a rua.';
      if (!formData.number.trim()) newErrors.number = 'Informe o número.';
      if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Informe o bairro.';
      if (!formData.city.trim()) newErrors.city = 'Informe a cidade.';
      if (formData.state.trim().length < 2) newErrors.state = 'UF inválida.';
    }

    if (current === 'pagamento' && formData.paymentMethod === 'cartao') {
      if (formData.cardNumber.replace(/\D/g, '').length < 13) newErrors.cardNumber = 'Número de cartão inválido.';
      if (!formData.cardName.trim()) newErrors.cardName = 'Informe o nome impresso no cartão.';
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Use o formato MM/AA.';
      if (formData.cardCvv.length < 3) newErrors.cardCvv = 'CVV inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setCompletedSteps((prev) => Array.from(new Set([...prev, step])));
    const currentIndex = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[Math.min(currentIndex + 1, STEP_ORDER.length - 1)]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    const currentIndex = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[Math.max(currentIndex - 1, 0)]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    // Em produção: enviar para services/orderService.ts (integração com gateway de pagamento)
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const generatedOrderNumber = `GB${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNumber);
    setIsSubmitting(false);
    setOrderCompleted(true);
    clearCart();
  };

  if (items.length === 0 && !orderCompleted) {
    return <Navigate to={ROUTES.cart} replace />;
  }

  if (orderCompleted) {
    return <OrderConfirmation orderNumber={orderNumber} email={formData.email} />;
  }

  const shippingOption = SHIPPING_OPTIONS.find((s) => s.id === formData.shippingMethodId);
  const freeShipping = subtotal() >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = formData.shippingMethodId === 'pickup' || freeShipping ? 0 : shippingOption?.price ?? 0;
  const total = subtotal() - discountAmount() + shippingCost;

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl text-ink-900">Finalizar compra</h1>

      <div className="mt-8 max-w-3xl">
        <CheckoutSteps currentStep={step} completedSteps={completedSteps} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="border border-ink-200 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 'identificacao' && (
                <StepIdentification data={formData} errors={errors} onChange={handleChange} onNext={goNext} />
              )}
              {step === 'endereco' && (
                <StepAddress data={formData} errors={errors} onChange={handleChange} onNext={goNext} onBack={goBack} />
              )}
              {step === 'entrega' && (
                <StepShipping
                  shippingMethodId={formData.shippingMethodId}
                  subtotal={subtotal()}
                  onSelect={(id) => handleChange('shippingMethodId', id)}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 'pagamento' && (
                <StepPayment
                  data={formData}
                  errors={errors}
                  total={total}
                  onChange={handleChange}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 'revisao' && (
                <StepReview
                  data={formData}
                  total={total}
                  isSubmitting={isSubmitting}
                  onEdit={setStep}
                  onBack={goBack}
                  onConfirm={handleConfirmOrder}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <OrderSummarySidebar shippingCost={shippingCost} />
      </div>
    </div>
  );
}
