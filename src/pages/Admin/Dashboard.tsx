import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp, TrendingDown, ShoppingBag, DollarSign,
  Package, AlertTriangle, ArrowUp, Clock, Bell, X, RefreshCw
} from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { CategoryPieChart } from '@/components/admin/CategoryPieChart';
import { dailySales as mockDailySales, topSellingProducts as mockTopProducts, salesByCategory } from '@/constants/salesData';
import { useExpensesStore } from '@/store/expensesStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { formatCurrency } from '@/utils/format';
import type { DailySalesPoint } from '@/types/admin';

interface TopProduct {
  name: string;
  revenue: number;
  unitsSold: number;
  stock?: number;
}

interface RecentOrder {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'completed';
  items: number;
}

interface AdminData {
  dailySales: DailySalesPoint[];
  totalRevenue: number;
  totalOrders: number;
  avgTicket: number;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  loading: boolean;
  error: string | null;
  lastSaleDate: string | null;
  lowStockProducts: TopProduct[];
}

function useAdminData() {
  const { token, mode } = useAdminAuthStore();
  const [data, setData] = useState<AdminData>({
    dailySales: [],
    totalRevenue: 0,
    totalOrders: 0,
    avgTicket: 0,
    topProducts: [],
    recentOrders: [],
    loading: true,
    error: null,
    lastSaleDate: null,
    lowStockProducts: [],
  });

  useEffect(() => {
    async function fetchData() {
      // Fallback to mock data if no backend
      if (mode !== 'backend' || !token) {
        const last30Days = mockDailySales.slice(-30);
        const totalRevenue = last30Days.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = last30Days.reduce((sum, d) => sum + d.orders, 0);
        const lastSaleDate = last30Days.length > 0 ? last30Days[last30Days.length - 1].date : null;
        const lowStock = mockTopProducts.filter(p => (p.unitsSold < 15 || (p.stock !== undefined && p.stock < 5)));

        setData({
          dailySales: last30Days,
          totalRevenue,
          totalOrders,
          avgTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          topProducts: mockTopProducts.slice(0, 5),
          recentOrders: Array.from({ length: 7 }, (_, i) => ({
            id: `ORD-${2024001 + i}`,
            date: new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR'),
            customer: ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Carla Mendes', 'Lucas Ferreira', 'Julia Rocha'][i],
            total: last30Days[i]?.revenue || 0,
            status: i === 0 ? 'pending' : i < 3 ? 'processing' : 'completed',
            items: Math.floor(Math.random() * 3) + 1,
          })),
          loading: false,
          error: null,
          lastSaleDate,
          lowStockProducts: lowStock,
        });
        return;
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const API_URL = import.meta.env.VITE_API_URL as string;

        const [dailyRes, ordersRes, productsRes, stockRes] = await Promise.all([
          fetch(`${API_URL}/api/sales/daily?days=30`, { headers }).catch(() => null),
          fetch(`${API_URL}/api/sales/orders?limit=10`, { headers }).catch(() => null),
          fetch(`${API_URL}/api/sales/top-products`, { headers }).catch(() => null),
          fetch(`${API_URL}/api/products/low-stock`, { headers }).catch(() => null),
        ]);

        const daily = dailyRes?.ok ? await dailyRes.json() : mockDailySales.slice(-30);
        const orders = ordersRes?.ok ? await ordersRes.json() : [];
        const products = productsRes?.ok ? await productsRes.json() : mockTopProducts.slice(0, 5);
        const lowStock = stockRes?.ok ? await stockRes.json() : [];

        const totalRevenue = daily.reduce((s: number, d: any) => s + d.revenue, 0);
        const totalOrders = daily.reduce((s: number, d: any) => s + d.orders, 0);
        const lastSaleDate = daily.length > 0 ? daily[daily.length - 1].date : null;

        setData({
          dailySales: daily,
          totalRevenue,
          totalOrders,
          avgTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          topProducts: products.slice(0, 5),
          recentOrders: orders.slice(0, 7).map((o: any) => ({
            id: o.id || o.number || `ORD-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date(o.date || o.createdAt).toLocaleDateString('pt-BR'),
            customer: o.customerName || o.customer || 'Cliente',
            total: o.total || o.totalAmount || 0,
            status: o.status === 'completed' || o.status === 'delivered' ? 'completed' :
                    o.status === 'processing' || o.status === 'pending' ? 'processing' : 'pending',
            items: o.items?.length || o.itemCount || 1,
          })),
          loading: false,
          error: null,
          lastSaleDate,
          lowStockProducts: lowStock.slice(0, 5),
        });
      } catch {
        // Fallback on error
        const last30Days = mockDailySales.slice(-30);
        setData({
          dailySales: last30Days,
          totalRevenue: last30Days.reduce((sum, d) => sum + d.revenue, 0),
          totalOrders: last30Days.reduce((sum, d) => sum + d.orders, 0),
          avgTicket: 0,
          topProducts: mockTopProducts.slice(0, 5),
          recentOrders: [],
          loading: false,
          error: 'Erro ao carregar dados. Usando dados de demonstração.',
          lastSaleDate: last30Days[last30Days.length - 1]?.date || null,
          lowStockProducts: [],
        });
      }
    }
    fetchData();
  }, [token, mode]);

  return data;
}

// Skeleton component for KPIs
function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      <div className="mt-3 h-8 bg-gray-200 rounded w-32" />
      <div className="mt-2 h-3 bg-gray-200 rounded w-20" />
    </div>
  );
}

// Alert types
interface Alert {
  id: string;
  type: 'warning' | 'danger';
  title: string;
  message: string;
  icon: typeof AlertTriangle;
}

function AlertBanner({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const bgColor = alert.type === 'danger' ? 'bg-danger/10 border-danger' : 'bg-gold-100 border-gold-500';
  const iconColor = alert.type === 'danger' ? 'text-danger' : 'text-gold-600';

  return (
    <div className={`flex items-center gap-3 rounded-sm border p-3 ${bgColor}`}>
      <alert.icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-900">{alert.title}</p>
        <p className="text-xs text-ink-600">{alert.message}</p>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="flex-shrink-0 rounded p-1 hover:bg-ink-100 text-ink-400 hover:text-ink-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { loading, totalRevenue, totalOrders, avgTicket, dailySales, topProducts, recentOrders, error, lastSaleDate, lowStockProducts } = useAdminData();
  const expenses = useExpensesStore((s) => s.expenses);
  const totalExpenses = useExpensesStore((s) => s.totalAmount());
  const getTotalViews = useAnalyticsStore((s) => s.getTotalViews);
  const getUniqueSessions = useAnalyticsStore((s) => s.getUniqueSessions);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Calculate metrics with comparison to previous period
  const metrics = useMemo(() => {
    const last30Days = dailySales.slice(-30);
    const previous30Days = dailySales.slice(-60, -30);

    const prevRevenue = previous30Days.reduce((sum, d) => sum + d.revenue, 0);
    const prevOrders = previous30Days.reduce((sum, d) => sum + d.orders, 0);
    const prevAvgTicket = prevOrders > 0 ? prevRevenue / prevOrders : 0;

    const netRevenue = totalRevenue - totalExpenses;
    const prevNetRevenue = prevRevenue - (previous30Days.length > 0 ? previous30Days.reduce((sum, d) => sum + d.revenue * 0.15, 0) : 0);

    return {
      totalRevenue,
      previousRevenue: prevRevenue,
      revenueGrowth: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
      totalOrders,
      previousOrders: prevOrders,
      ordersGrowth: prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0,
      avgTicket,
      previousAvgTicket: prevAvgTicket,
      ticketGrowth: prevAvgTicket > 0 ? ((avgTicket - prevAvgTicket) / prevAvgTicket) * 100 : 0,
      netRevenue,
      previousNetRevenue: prevNetRevenue,
      netGrowth: prevNetRevenue !== 0 ? ((netRevenue - prevNetRevenue) / Math.abs(prevNetRevenue)) * 100 : 0,
      conversionRate: 3.2,
      previousConversionRate: 2.8,
    };
  }, [dailySales, totalRevenue, totalOrders, avgTicket, totalExpenses]);

  // Generate alerts
  const alerts = useMemo((): Alert[] => {
    const newAlerts: Alert[] = [];

    // Low stock alert
    if (lowStockProducts.length > 0) {
      const productNames = lowStockProducts.slice(0, 3).map(p => p.name).join(', ');
      newAlerts.push({
        id: 'low-stock',
        type: 'warning',
        title: 'Estoque baixo',
        message: `${lowStockProducts.length} produto(s) com menos de 5 unidades: ${productNames}${lowStockProducts.length > 3 ? '...' : ''}`,
        icon: Package,
      });
    }

    // Pending expenses > 30 days
    const oldExpenses = expenses.filter(e => {
      if (e.paid) return false;
      const expenseDate = new Date(e.expenseDate);
      const daysDiff = (Date.now() - expenseDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 30;
    });
    if (oldExpenses.length > 0) {
      const totalOld = oldExpenses.reduce((sum, e) => sum + e.amount, 0);
      newAlerts.push({
        id: 'pending-expenses',
        type: 'danger',
        title: 'Despesas pendentes',
        message: `${oldExpenses.length} despesa(s) vencida(s) há mais de 30 dias. Total: ${formatCurrency(totalOld)}`,
        icon: AlertTriangle,
      });
    }

    // No recent sales
    if (lastSaleDate) {
      const lastSale = new Date(lastSaleDate);
      const daysSinceLastSale = (Date.now() - lastSale.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSale > 7) {
        newAlerts.push({
          id: 'no-recent-sales',
          type: 'danger',
          title: 'Sem vendas recentes',
          message: `Última venda há ${Math.floor(daysSinceLastSale)} dias. Considere revisar preços ou campanhas.`,
          icon: ShoppingBag,
        });
      }
    }

    return newAlerts.filter(a => !dismissedAlerts.has(a.id));
  }, [expenses, lastSaleDate, lowStockProducts, dismissedAlerts]);

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 className="mt-1 font-display text-3xl text-ink-900">Visão geral do negócio</h1>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-1.5 rounded-sm bg-danger/10 px-3 py-1.5 text-xs text-danger">
              <RefreshCw className="h-3.5 w-3.5" />
              {error}
            </div>
          )}
          <div className="flex items-center gap-2 rounded-sm bg-ink-100 px-3 py-1.5 text-xs text-ink-600">
            <Clock className="h-3.5 w-3.5" />
            Atualizado agora
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <AlertBanner key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
          ))}
        </div>
      )}

      {/* Main KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
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
            <SalesChart data={dailySales} />
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
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 flex-1 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
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
            ) : (
              <p className="py-8 text-center text-sm text-ink-400">Nenhum pedido encontrado</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Produtos mais vendidos</h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="mt-1 h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))
            ) : topProducts.length > 0 ? (
              topProducts.map((product, i) => (
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
              ))
            ) : (
              <p className="py-8 text-center text-sm text-ink-400">Nenhum produto encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
