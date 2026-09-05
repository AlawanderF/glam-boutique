import { useState } from 'react';
import { Check, ChevronDown, Package } from 'lucide-react';
import { mockOrders, type Order, type OrderStatus } from '@/constants/orders';
import { formatCurrency, classNames } from '@/utils/format';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  processando: { label: 'Processando', className: 'bg-info/10 text-info' },
  enviado: { label: 'Enviado', className: 'bg-gold-100 text-gold-700' },
  entregue: { label: 'Entregue', className: 'bg-success/10 text-success' },
  cancelado: { label: 'Cancelado', className: 'bg-danger/10 text-danger' },
};

interface OrderItemType {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface TrackingStepType {
  label: string;
  done: boolean;
  date?: string;
}

export default function Orders() {
  const orders: Order[] = mockOrders || [];
  const initialExpandedId = orders.length > 0 ? orders[0]?.id ?? null : null;
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-ink-200 py-20 text-center">
        <Package className="h-10 w-10 text-ink-300" />
        <p className="mt-3 text-sm text-ink-500">Você ainda não fez nenhum pedido.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {orders.map((order: Order) => {
        const isExpanded = expandedId === order.id;
        const statusConfig = STATUS_CONFIG[order.status];

        return (
          <div key={order.id} className="border border-ink-200">
            <button
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
              aria-expanded={isExpanded}
            >
              <div>
                <p className="text-sm font-semibold text-ink-900">Pedido #{order.number}</p>
                <p className="text-xs text-ink-500">
                  {new Date(order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={classNames('rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-wide', statusConfig.className)}>
                {statusConfig.label}
              </span>
              <span className="font-display text-base text-ink-900">{formatCurrency(order.total)}</span>
              <ChevronDown className={classNames('h-4 w-4 text-ink-500 transition-transform', isExpanded && 'rotate-180')} />
            </button>

            {isExpanded && (
              <div className="border-t border-ink-200 p-5">
                <ul className="flex flex-col gap-3">
                  {order.items.map((item: OrderItemType, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-14 w-12 rounded-sm object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-ink-800">{item.name}</p>
                        <p className="text-xs text-ink-500">Quantidade: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-ink-700">{formatCurrency(item.price)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Status do rastreamento</p>
                  <ol className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-2">
                    {order.trackingSteps.map((trackingStep: TrackingStepType, i: number) => (
                      <li key={i} className="flex flex-1 items-center gap-2 sm:flex-col sm:items-center sm:text-center">
                        <span
                          className={classNames(
                            'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-2xs',
                            trackingStep.done ? 'bg-ink-900 text-cream-50' : 'bg-ink-100 text-ink-400'
                          )}
                        >
                          {trackingStep.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <div className="sm:mt-1">
                          <p className={classNames('text-xs', trackingStep.done ? 'font-medium text-ink-900' : 'text-ink-400')}>
                            {trackingStep.label}
                          </p>
                          {trackingStep.date && <p className="text-2xs text-ink-400">{trackingStep.date}</p>}
                        </div>
                        {i < order.trackingSteps.length - 1 && (
                          <span className="hidden h-px flex-1 bg-ink-200 sm:block" />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
