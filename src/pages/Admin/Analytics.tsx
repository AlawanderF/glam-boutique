import { useMemo } from 'react';
import {
  Eye, Users, Smartphone, Monitor, Globe, Clock,
  TrendingUp, TrendingDown, ArrowUp, ArrowDown, ShoppingBag
} from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { trafficSources, dailySales } from '@/constants/salesData';
import { formatCurrency } from '@/utils/format';

export default function Analytics() {
  const pageViews = useAnalyticsStore((s) => s.pageViews);
  const getTotalViews = useAnalyticsStore((s) => s.getTotalViews);
  const getUniqueSessions = useAnalyticsStore((s) => s.getUniqueSessions);
  const getViewsByPath = useAnalyticsStore((s) => s.getViewsByPath);

  const metrics = useMemo(() => {
    const totalViews = getTotalViews();
    const uniqueSessions = getUniqueSessions();
    const viewsByPath = getViewsByPath();

    const mobileViews = pageViews.filter((v) => v.device === 'mobile').length;
    const desktopViews = pageViews.length - mobileViews;

    const directTraffic = pageViews.filter((v) => v.referrer === 'direto').length;
    const socialTraffic = pageViews.filter((v) =>
      v.referrer.includes('facebook') || v.referrer.includes('instagram') || v.referrer.includes('twitter')
    ).length;
    const searchTraffic = pageViews.filter((v) =>
      v.referrer.includes('google') || v.referrer.includes('bing')
    ).length;

    const last7Days = dailySales.slice(-7);
    const previous7Days = dailySales.slice(-14, -7);
    const recentRevenue = last7Days.reduce((s, d) => s + d.revenue, 0);
    const previousRevenue = previous7Days.reduce((s, d) => s + d.revenue, 0);
    const revenueGrowth = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const recentOrders = last7Days.reduce((s, d) => s + d.orders, 0);
    const previousOrders = previous7Days.reduce((s, d) => s + d.orders, 0);
    const ordersGrowth = previousOrders > 0
      ? ((recentOrders - previousOrders) / previousOrders) * 100
      : 0;

    return {
      totalViews,
      uniqueSessions,
      mobileViews,
      desktopViews,
      directTraffic,
      socialTraffic,
      searchTraffic,
      viewsByPath,
      recentRevenue,
      revenueGrowth,
      recentOrders,
      ordersGrowth,
    };
  }, [pageViews, getTotalViews, getUniqueSessions, getViewsByPath]);

  const maxViewCount = Math.max(...metrics.viewsByPath.slice(0, 8).map((p) => p.count), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="eyebrow">Métricas</span>
        <h1 className="mt-1 font-display text-3xl text-ink-900">Visitantes e tráfego</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Dados combinados de visitas rastreadas (neste navegador) com métricas ilustrativas.
          Para analytics consolidado de todos os visitantes, configure o backend MySQL.
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Visualizações de página"
          value={String(metrics.totalViews)}
          icon={Eye}
          accent="ink"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          label="Sessões únicas"
          value={String(metrics.uniqueSessions)}
          icon={Users}
          accent="gold"
          trend={{ value: 8.3, isPositive: true }}
        />
        <KpiCard
          label="Tráfego mobile"
          value={`${metrics.totalViews > 0 ? Math.round((metrics.mobileViews / metrics.totalViews) * 100) : 0}%`}
          icon={Smartphone}
          accent="ink"
        />
        <KpiCard
          label="Tráfego desktop"
          value={`${metrics.totalViews > 0 ? Math.round((metrics.desktopViews / metrics.totalViews) * 100) : 0}%`}
          icon={Monitor}
          accent="ink"
        />
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Páginas mais visitadas</h2>
            <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
              {metrics.viewsByPath.length} páginas
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {metrics.viewsByPath.slice(0, 8).map((page, i) => {
              const percentage = (page.count / maxViewCount) * 100;
              return (
                <div key={page.path}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-700">
                      {page.path === '/' ? 'Home' : page.path.replace(/\//g, ' > ').replace(/^-/, '')}
                    </span>
                    <span className="font-medium text-ink-900">{page.count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-ink-900 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {metrics.viewsByPath.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-400">
                Navegue pela loja para ver dados de páginas
              </p>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Origem do tráfego</h2>
          <div className="mt-6 space-y-4">
            {[
              { label: 'Direto', value: metrics.directTraffic || 156, color: 'bg-ink-900', icon: Globe },
              { label: 'Redes sociais', value: metrics.socialTraffic || 89, color: 'bg-gold-500', icon: Globe },
              { label: 'Busca orgânica', value: metrics.searchTraffic || 234, color: 'bg-success', icon: Globe },
              { label: 'Outros', value: Math.max(0, metrics.totalViews - metrics.directTraffic - metrics.socialTraffic - metrics.searchTraffic) || 45, color: 'bg-ink-300', icon: Globe },
            ].map((source) => {
              const total = metrics.totalViews || 524;
              const percentage = total > 0 ? (source.value / total) * 100 : 0;
              return (
                <div key={source.label} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${source.color} text-cream-50`}>
                    <source.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink-900">{source.label}</span>
                      <span className="text-ink-500">
                        {source.value} visitas ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full ${source.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <div className="flex items-center gap-2 text-ink-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Receita (7d)</span>
          </div>
          <p className="mt-2 font-display text-xl text-ink-900">{formatCurrency(metrics.recentRevenue)}</p>
          <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${metrics.revenueGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
            {metrics.revenueGrowth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(metrics.revenueGrowth).toFixed(1)}% vs semana anterior
          </p>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <div className="flex items-center gap-2 text-ink-500">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Pedidos (7d)</span>
          </div>
          <p className="mt-2 font-display text-xl text-ink-900">{metrics.recentOrders}</p>
          <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${metrics.ordersGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
            {metrics.ordersGrowth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(metrics.ordersGrowth).toFixed(1)}% vs semana anterior
          </p>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <div className="flex items-center gap-2 text-ink-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Tempo médio</span>
          </div>
          <p className="mt-2 font-display text-xl text-ink-900">3m 42s</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-success">
            <ArrowUp className="h-3 w-3" />
            +12% vs período anterior
          </p>
        </div>
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-4">
          <div className="flex items-center gap-2 text-ink-500">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Taxa rejeição</span>
          </div>
          <p className="mt-2 font-display text-xl text-ink-900">42.3%</p>
          <p className={`mt-1 flex items-center gap-1 text-xs ${metrics.revenueGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
            {metrics.revenueGrowth >= 0 ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
            -{Math.abs(5.2).toFixed(1)}% vs período anterior
          </p>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Dispositivos</h2>
        <div className="mt-4 flex gap-8">
          <div className="flex items-center gap-4">
            <Smartphone className="h-8 w-8 text-ink-400" />
            <div>
              <p className="text-2xs text-ink-500 uppercase tracking-wider">Mobile</p>
              <p className="mt-1 font-display text-2xl text-ink-900">
                {metrics.totalViews > 0 ? Math.round((metrics.mobileViews / metrics.totalViews) * 100) : 58}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Monitor className="h-8 w-8 text-ink-400" />
            <div>
              <p className="text-2xs text-ink-500 uppercase tracking-wider">Desktop</p>
              <p className="mt-1 font-display text-2xl text-ink-900">
                {metrics.totalViews > 0 ? Math.round((metrics.desktopViews / metrics.totalViews) * 100) : 42}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
