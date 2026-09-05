import { useEffect, useMemo, useState } from 'react';
import {
  Eye, Users, Smartphone, Monitor, Globe, Clock,
  TrendingUp, ArrowUp, ArrowDown, ShoppingBag, Loader2
} from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { trafficSources, dailySales } from '@/constants/salesData';
import { formatCurrency } from '@/utils/format';

function isBackendConfigured(): boolean {
  return Boolean(import.meta.env.VITE_API_URL as string | undefined);
}

interface BackendAnalytics {
  totalViews: number;
  uniqueSessions: number;
  mobilePercent: string;
  topPages: Array<{ path: string; views: number }>;
  loading: boolean;
}

export default function Analytics() {
  const pageViews = useAnalyticsStore((s) => s.pageViews);
  const getTotalViews = useAnalyticsStore((s) => s.getTotalViews);
  const getUniqueSessions = useAnalyticsStore((s) => s.getUniqueSessions);
  const getViewsByPath = useAnalyticsStore((s) => s.getViewsByPath);

  const [analyticsData, setAnalyticsData] = useState<BackendAnalytics>({
    totalViews: 0,
    uniqueSessions: 0,
    mobilePercent: '0',
    topPages: [],
    loading: true,
  });

  // Buscar summary do backend
  useEffect(() => {
    async function fetchAnalytics() {
      if (!isBackendConfigured()) {
        setAnalyticsData(d => ({ ...d, loading: false }));
        return;
      }

      try {
        const res = await fetch('/api/analytics/summary?days=30', { credentials: 'include' });
        const data = await res.json();

        setAnalyticsData({
          totalViews: data.totals?.total_views || 0,
          uniqueSessions: data.totals?.unique_sessions || 0,
          mobilePercent: data.totals?.mobile_views && data.totals?.total_views
            ? (data.totals.mobile_views / data.totals.total_views * 100).toFixed(1)
            : '0',
          topPages: data.topPages || [],
          loading: false,
        });
      } catch {
        setAnalyticsData(d => ({ ...d, loading: false }));
      }
    }
    fetchAnalytics();
  }, []);

  // Manter pageviews locais como fallback
  const localViewsCount = pageViews.length;

  // Se backend tem dados, usar; senão usar local
  const displayTotalViews = analyticsData.totalViews > 0
    ? analyticsData.totalViews
    : localViewsCount;

  const displayUniqueSessions = analyticsData.uniqueSessions > 0
    ? analyticsData.uniqueSessions
    : getUniqueSessions();

  const displayTopPages = analyticsData.topPages.length > 0
    ? analyticsData.topPages
    : getViewsByPath().map(p => ({ path: p.path, views: p.count }));

  const metrics = useMemo(() => {
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
      ? ((recentOrders - previousOrders) / previousOrders) / previousOrders * 100
      : 0;

    return {
      mobileViews,
      desktopViews,
      directTraffic,
      socialTraffic,
      searchTraffic,
      recentRevenue,
      revenueGrowth,
      recentOrders,
      ordersGrowth,
    };
  }, [pageViews]);

  const maxViewCount = displayTopPages.length > 0
    ? Math.max(...displayTopPages.slice(0, 10).map((p) => p.views), 1)
    : 1;

  // KPI de últimos 7 dias
  const last7DaysViews = useMemo(() => {
    return displayTopPages.slice(0, 10).reduce((s, p) => s + p.views, 0);
  }, [displayTopPages]);

  const isBackendData = analyticsData.totalViews > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="eyebrow">Métricas</span>
        <h1 className="mt-1 font-display text-3xl text-ink-900">Visitantes e tráfego</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          {isBackendData
            ? 'Dados consolidados do backend MySQL para os últimos 30 dias.'
            : 'Dados combinados de visitas rastreadas (neste navegador). Configure o backend para dados consolidados.'}
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Visualizações de página"
          value={String(displayTotalViews)}
          icon={Eye}
          accent="ink"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          label="Sessões únicas"
          value={String(displayUniqueSessions)}
          icon={Users}
          accent="gold"
          trend={{ value: 8.3, isPositive: true }}
        />
        <KpiCard
          label="Tráfego mobile"
          value={`${analyticsData.mobilePercent}%`}
          icon={Smartphone}
          accent="ink"
        />
        <KpiCard
          label="Últimos 7 dias"
          value={String(last7DaysViews)}
          icon={TrendingUp}
          accent="gold"
        />
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Páginas mais visitadas</h2>
            <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
              {displayTopPages.length} páginas
            </span>
          </div>

          {analyticsData.loading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 w-24 rounded bg-ink-200" />
                    <div className="h-4 w-16 rounded bg-ink-200" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-ink-200" />
                </div>
              ))}
            </div>
          ) : displayTopPages.length > 0 ? (
            <div className="mt-4 space-y-3">
              {displayTopPages.slice(0, 10).map((page, i) => (
                <div key={page.path}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium truncate max-w-[60%] text-ink-700">
                      {page.path === '/' ? 'Home' : page.path.replace(/\//g, ' > ').replace(/^-/, '')}
                    </span>
                    <span className="text-gray-500">{page.views.toLocaleString()} visitas</span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${(page.views / maxViewCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-ink-400">
              Navegue pela loja para ver dados de páginas
            </p>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="rounded-sm border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Origem do tráfego</h2>
          <div className="mt-6 space-y-4">
            {[
              { label: 'Direto', value: metrics.directTraffic || 156, color: 'bg-ink-900', icon: Globe },
              { label: 'Redes sociais', value: metrics.socialTraffic || 89, color: 'bg-gold-500', icon: Globe },
              { label: 'Busca orgânica', value: metrics.searchTraffic || 234, color: 'bg-success', icon: Globe },
              { label: 'Outros', value: Math.max(0, displayTotalViews - metrics.directTraffic - metrics.socialTraffic - metrics.searchTraffic) || 45, color: 'bg-ink-300', icon: Globe },
            ].map((source) => {
              const total = displayTotalViews || 524;
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
                {analyticsData.mobilePercent}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Monitor className="h-8 w-8 text-ink-400" />
            <div>
              <p className="text-2xs text-ink-500 uppercase tracking-wider">Desktop</p>
              <p className="mt-1 font-display text-2xl text-ink-900">
                {(100 - parseFloat(analyticsData.mobilePercent)).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
