import { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign,
  Package, AlertTriangle, ArrowUp, ArrowDown, Eye, Clock
} from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RevenueTrendChart } from '@/components/admin/RevenueTrendChart';
import { CategoryPieChart } from '@/components/admin/CategoryPieChart';
import { dailySales, topSellingProducts, orderStatusData, salesByCategory } from '@/constants/salesData';
import { useExpensesStore } from '@/store/expensesStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { formatCurrency } from '@/utils/format';

export default function Dashboard() {
  const expenses = useExpensesStore((s) => s.expenses);
  const totalExpenses = useExpensesStore((s) => s.totalAmount());
  const pageViews = useAnalyticsStore((s) => s.pageViews);
  const getTotalViews = useAnalyticsStore((s) => s.getTotalViews);
  const getUniqueSessions = useAnalyticsStore((s) => s.getUniqueSessions);

  const metrics = useMemo(() => {
    const last30Days = dailySales.slice(-30);
    const previous30Days = dailySales.slice(-60, -30);

    const totalRevenue = last30Days.reduce((sum, d) => sum + d.revenue, 0);
    const previousRevenue = previous30Days.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = last30Days.reduce((sum, d) => sum + d.orders, 0);
    const previousOrders = previous30Days.reduce((sum, d) => sum + d.orders, 0);

    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const previousAvgTicket = previousOrders > 0 ? previousRevenue / previousOrders : 0;

    const netRevenue = totalRevenue - totalExpenses;
    const previousNetRevenue = previousRevenue - (previous30Days.length > 0 ? previous30Days.reduce((sum, d) => sum + d.revenue * 0.15, 0) : 0);

    return {
      totalRevenue,
      previousRevenue,
      revenueGrowth: previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0,
      totalOrders,
      previousOrders,
      ordersGrowth: previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0,
      avgTicket,
      previousAvgTicket,
      ticketGrowth: previousAvgTicket > 0 ? ((avgTicket - previousAvgTicket) / previousAvgTicket) * 100 : 0,
      netRevenue,
      previousNetRevenue,
      netGrowth: previousNetRevenue > 0 ? ((netRevenue - previousNetRevenue) / Math.abs(previousNetRevenue)) * 100 : 0,
      conversionRate: 3.2,
      previousConversionRate: 2.8,
    };
  }, [totalExpenses]);

  const lowStockProducts = useMemo(() => {
    return topSellingProducts.filter(p => p.unitsSold < 15).slice(0, 5);
  }, []);

  const recentOrders = useMemo(() => {
    return dailySales.slice(-7).map((d, i) => ({
      id: `ORD-${2024001 + i}`,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR'),
      customer: ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Carla Mendes', 'Lucas Ferreira', 'Julia Rocha'][i],
      total: d.revenue,
      status: i === 0 ? 'pending' : i < 3 ? 'processing' : 'completed',
      items: Math.floor(Math.random() * 3) + 1,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 className="mt-1 font-display text-3xl text-ink-900">Visão geral do negócio</h1>
        </div>
        <div className="flex items-center gap-2 rounded-sm bg-ink-100 px-3 py-1.5 text-xs text-ink-600">
          <Clock className="h-3.5 w-3.5" />
          Atualizado agora
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Receita bruta (30d)"
          value={formatCurrency(metrics.totalRevenue)}
          icon={DollarSign}
          accent="gold"
          trend={{ value: Math.abs(metrics.revenueGrowth), isPositive: metrics.revenueGrowth >= 0 }}
        />
        <KpiCard
          label="Pedidos (30d)"
          value={String(metrics.totalOrders)}
          icon={ShoppingBag}
          accent="ink"
          trend={{ value: Math.abs(metrics.ordersGrowth), isPositive: metrics.ordersGrowth >= 0 }}
        />
        <KpiCard
          label="Ticket médio"
          value={formatCurrency(metrics.avgTicket)}
          icon={TrendingUp}
          accent="ink"
          trend={{ value: Math.abs(metrics.ticketGrowth), isPositive: metrics.ticketGrowth >= 0 }}
        />
        <KpiCard
          label="Receita líquida"
          value={formatCurrency(metrics.netRevenue)}
          icon={metrics.netRevenue >= 0 ? TrendingUp : TrendingDown}
          accent={metrics.netRevenue >= 0 ? 'success' : 'danger'}
          trend={{ value: Math.abs(metrics.netGrowth), isPositive: metrics.netGrowth >= 0 }}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <p className="text-xs text-ink-500">Taxa de conversão</p>
          <p className="mt-1 font-display text-xl text-ink-900">{metrics.conversionRate}%</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-success">
            <ArrowUp className="h-3 w-3" />
            +0.4% vs período anterior
          </p>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <p className="text-xs text-ink-500">Visitas (este navegador)</p>
          <p className="mt-1 font-display text-xl text-ink-900">{getTotalViews()}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
            {getUniqueSessions()} sessões únicas
          </p>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <p className="text-xs text-ink-500">Saídas (despesas)</p>
          <p className="mt-1 font-display text-xl text-ink-900">{formatCurrency(totalExpenses)}</p>
          <p className="mt-1 text-xs text-ink-400">{expenses.length} lançamentos</p>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <p className="text-xs text-ink-500">Produtos baixo estoque</p>
          <p className="mt-1 font-display text-xl text-ink-900">{lowStockProducts.length}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-danger">
            <AlertTriangle className="h-3 w-3" />
            Repor em breve
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-sm border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Receita nos últimos 30 dias</h2>
          <div className="mt-4 h-72">
            <SalesChart data={dailySales.slice(-30)} />
          </div>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Vendas por categoria</h2>
          <div className="mt-4 h-72">
            <CategoryPieChart data={salesByCategory} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Pedidos recentes</h2>
            <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">7 últimos dias</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-2xs uppercase tracking-wider text-ink-400">
                  <th className="pb-3 pr-4">Pedido</th>
                  <th className="pb-3 pr-4">Cliente</th>
                  <th className="pb-3 pr-4">Valor</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ink-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink-900">{order.id}</td>
                    <td className="py-3 pr-4 text-ink-600">{order.customer}</td>
                    <td className="py-3 pr-4 font-medium text-ink-900">{formatCurrency(order.total)}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === 'completed' ? 'bg-success/10 text-success' :
                        order.status === 'processing' ? 'bg-gold-100 text-gold-700' :
                        'bg-ink-100 text-ink-600'
                      }`}>
                        {order.status === 'completed' ? 'Concluído' : order.status === 'processing' ? 'Processando' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Produtos mais vendidos</h2>
          <div className="mt-4 space-y-3">
            {topSellingProducts.slice(0, 6).map((product, i) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? 'bg-gold-500 text-ink-950' :
                    i === 1 ? 'bg-ink-300 text-ink-950' :
                    i === 2 ? 'bg-gold-200 text-ink-950' :
                    'bg-ink-100 text-ink-500'
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-500">{product.unitsSold} unidades</p>
                  </div>
                </div>
                <p className="font-display text-sm font-medium text-ink-900">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
