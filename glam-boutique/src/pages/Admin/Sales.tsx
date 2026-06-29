import { useState } from 'react';
import { SalesChart } from '@/components/admin/SalesChart';
import { dailySales, topSellingProducts } from '@/constants/salesData';
import { mockOrders } from '@/constants/orders';
import { formatCurrency, classNames } from '@/utils/format';

const RANGE_OPTIONS = [
  { days: 7, label: '7 dias' },
  { days: 14, label: '14 dias' },
  { days: 30, label: '30 dias' },
];

const STATUS_LABELS: Record<string, string> = {
  processando: 'Processando',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export default function Sales() {
  const [rangeDays, setRangeDays] = useState(30);
  const filteredSales = dailySales.slice(-rangeDays);
  const totalRevenue = filteredSales.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = filteredSales.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Desempenho comercial</span>
          <h1 className="mt-1 font-display text-3xl text-ink-900">Vendas</h1>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setRangeDays(opt.days)}
              className={classNames(
                'rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition-colors',
                rangeDays === opt.days ? 'bg-ink-900 text-cream-50' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Receita no período</span>
          <p className="mt-2 font-display text-2xl text-ink-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Pedidos no período</span>
          <p className="mt-2 font-display text-2xl text-ink-900">{totalOrders}</p>
        </div>
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Ticket médio</span>
          <p className="mt-2 font-display text-2xl text-ink-900">
            {formatCurrency(totalOrders > 0 ? totalRevenue / totalOrders : 0)}
          </p>
        </div>
      </div>

      <div className="border border-ink-200 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Receita por dia</h2>
        <div className="mt-4">
          <SalesChart data={filteredSales} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Pedidos recentes</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {mockOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between border-b border-ink-100 pb-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">#{order.number}</p>
                  <p className="text-xs text-ink-500">
                    {new Date(order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} ·{' '}
                    {STATUS_LABELS[order.status]}
                  </p>
                </div>
                <span className="font-display text-base text-ink-900">{formatCurrency(order.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Mais vendidos</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {topSellingProducts.map((product) => (
              <li key={product.name} className="flex items-center justify-between border-b border-ink-100 pb-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">{product.name}</p>
                  <p className="text-xs text-ink-500">{product.unitsSold} unidades</p>
                </div>
                <span className="font-display text-base text-ink-900">{formatCurrency(product.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
