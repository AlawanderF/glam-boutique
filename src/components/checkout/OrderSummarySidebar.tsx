import { ShieldCheck, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/format';

interface OrderSummarySidebarProps {
  shippingCost: number;
}

export function OrderSummarySidebar({ shippingCost }: OrderSummarySidebarProps) {
  const { items, subtotal, discountAmount, couponCode } = useCartStore();
  const total = subtotal() - discountAmount() + shippingCost;

  return (
    <aside className="h-fit border border-ink-200 p-6">
      <h2 className="font-display text-lg text-ink-900">Resumo do pedido</h2>

      <ul className="mt-4 flex flex-col gap-3 border-b border-ink-200 pb-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative h-16 w-12 flex-shrink-0">
              <img src={item.image} alt={item.name} className="h-full w-full rounded-sm object-cover" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-2xs font-bold text-cream-50">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-xs font-medium text-ink-900 line-clamp-1">{item.name}</p>
              <p className="text-2xs text-ink-400">{[item.colorName, item.sizeLabel].filter(Boolean).join(' · ')}</p>
            </div>
            <span className="text-xs font-semibold text-ink-700">{formatCurrency(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-ink-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal())}</span>
        </div>
        {couponCode && (
          <div className="flex justify-between text-success">
            <span>Cupom {couponCode}</span>
            <span>-{formatCurrency(discountAmount())}</span>
          </div>
        )}
        <div className="flex justify-between text-ink-600">
          <span>Frete</span>
          <span>{shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-ink-200 pt-4">
        <span className="font-display text-base text-ink-900">Total</span>
        <span className="font-display text-xl text-ink-900">{formatCurrency(total)}</span>
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-ink-200 pt-4 text-2xs text-ink-500">
        <p className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-gold-600" /> Conexão segura e criptografada
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-600" /> Seus dados nunca são compartilhados
        </p>
      </div>
    </aside>
  );
}
