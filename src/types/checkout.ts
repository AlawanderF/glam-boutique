export type CheckoutStep = 'identificacao' | 'endereco' | 'entrega' | 'pagamento' | 'revisao';

export type PaymentMethod = 'pix' | 'cartao' | 'boleto' | 'carteira';

export interface CheckoutFormData {
  // Identificação
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  // Endereço
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  // Entrega
  shippingMethodId: string;
  // Pagamento — string para suportar métodos customizados cadastrados no admin
  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  installments: number;
}

export const EMPTY_CHECKOUT_FORM: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  cpf: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  shippingMethodId: 'standard',
  paymentMethod: 'pix',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  installments: 1,
};

export const CHECKOUT_STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'entrega', label: 'Entrega' },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'revisao', label: 'Revisão' },
];
