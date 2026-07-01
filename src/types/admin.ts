export type ExpenseCategory =
  | 'fornecedores'
  | 'aluguel'
  | 'marketing'
  | 'salarios'
  | 'logistica'
  | 'impostos'
  | 'outros';

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // ISO
  paid: boolean;
}

export interface PageView {
  id: string;
  path: string;
  timestamp: string; // ISO
  device: 'mobile' | 'desktop';
  referrer: string;
  sessionId: string;
}

export interface DailySalesPoint {
  date: string; // ISO (yyyy-mm-dd)
  revenue: number;
  orders: number;
}

export type AdminPaymentMethodId = 'pix' | 'cartao' | 'boleto' | 'carteira';

export interface AdminPaymentMethodConfig {
  id: AdminPaymentMethodId | string;
  label: string;
  enabled: boolean;
  discountPercent?: number;
  maxInstallments?: number;
  isCustom?: boolean;
}
