import { useMemo } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingDown, Percent } from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { dailySales, topSellingProducts } from '@/constants/salesData';
import { useExpensesStore } from '@/store/expensesStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { formatCurrency } from '@/utils/format';

export default function Dashboard() {
  const totalExpenses = useExpensesStore((s) => s.totalAmount());
  const totalViews = useAnalyticsStore((s) => s.totalViews());
  const uniqueSessions = useAnalyticsStore((s) => s.uniqueSessions());

  const { totalRevenue, totalOrders, averageTicket } = useMemo(() => {
    const totalRevenue = dailySales.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = dailySales.reduce((sum, d) => sum + d.orders, 0);
    return {
      totalRevenue,
      totalOrders,
      averageTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }, []);

  const netRevenue = totalRevenue - totalExpenses;
  const last7 = dailySales.slice(-7);
  const previous7 = dailySales.slice(-14, -7);
  const last7Revenue = last7.reduce((s, d) => s + d.revenue, 0);
  const previous7Revenue = previous7.reduce((s, d) => s + d.revenue, 0);
  const revenueTrend = previous7Revenue > 0 ? Math.round(((last7Revenue - previous7Revenue) / previous7Revenue) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Últimos 30 dias</span>
        <h1 className="mt-1 font-display text-3xl text-ink-900">Visão geral do negócio</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Receita bruta"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          accent="gold"
          trend={{ value: Math.abs(revenueTrend), isPositive: revenueTrend >= 0 }}
        />
        <KpiCard label="Pedidos" value={String(totalOrders)} icon={ShoppingBag} accent="ink" />
        <KpiCard label="Ticket médio" value={formatCurrency(averageTicket)} icon={Percent} accent="ink" />
        <KpiCard
          label="Saídas (despesas)"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          accent="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Receita líquida (30d)" value={formatCurrency(netRevenue)} icon={DollarSign} accent="success" />
        <KpiCard label="Visitas (este navegador)" value={String(totalViews)} icon={Users} accent="ink" />
        <KpiCard label="Sessões únicas" value={String(uniqueSessions)} icon={Users} accent="gold" />
      </div>

      <div className="border border-ink-200 bg-cream-50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink-900">Receita nos últimos 30 dias</h2>
        </div>
        <div className="mt-4">
          <SalesChart data={dailySales} />
        </div>
      </div>

      <div className="border border-ink-200 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Produtos mais vendidos</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-2xs uppercase tracking-wider text-ink-400">
                <th className="py-2 pr-4">Produto</th>
                <th className="py-2 pr-4">Unidades vendidas</th>
                <th className="py-2">Receita gerada</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product) => (
                <tr key={product.name} className="border-b border-ink-100">
                  <td className="py-3 pr-4 text-ink-800">{product.name}</td>
                  <td className="py-3 pr-4 text-ink-600">{product.unitsSold}</td>
                  <td className="py-3 font-medium text-ink-900">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
