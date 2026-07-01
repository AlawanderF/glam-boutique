import { useMemo } from 'react';
import { Eye, Users, Smartphone, Monitor } from 'lucide-react';
import { KpiCard } from '@/components/admin/KpiCard';
import { VisitsBarChart } from '@/components/admin/VisitsBarChart';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { trafficSources } from '@/constants/salesData';

export default function Analytics() {
  const pageViews = useAnalyticsStore((s) => s.pageViews);
  const totalViews = useAnalyticsStore((s) => s.totalViews());
  const uniqueSessions = useAnalyticsStore((s) => s.uniqueSessions());
  const viewsByPath = useAnalyticsStore((s) => s.viewsByPath());

  const deviceBreakdown = useMemo(() => {
    const mobile = pageViews.filter((v) => v.device === 'mobile').length;
    const desktop = pageViews.length - mobile;
    return { mobile, desktop };
  }, [pageViews]);

  const topPagesData = viewsByPath.slice(0, 6).map((p) => ({ label: p.path === '/' ? 'Home' : p.path, value: p.count }));
  const trafficData = trafficSources.map((t) => ({ label: t.source, value: t.visits }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Comportamento do público</span>
        <h1 className="mt-1 font-display text-3xl text-ink-900">Visitantes e tráfego</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          As métricas abaixo combinam <strong>visitas reais deste navegador</strong> (rastreadas localmente a cada
          troca de página) com dados de tráfego ilustrativos. Para analytics consolidado de todos os visitantes do
          site, é necessário um backend com banco de dados — veja a seção de integração com MySQL no README.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Visualizações de página" value={String(totalViews)} icon={Eye} accent="ink" />
        <KpiCard label="Sessões únicas" value={String(uniqueSessions)} icon={Users} accent="gold" />
        <KpiCard label="Acessos via mobile" value={String(deviceBreakdown.mobile)} icon={Smartphone} accent="ink" />
        <KpiCard label="Acessos via desktop" value={String(deviceBreakdown.desktop)} icon={Monitor} accent="ink" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Páginas mais visitadas (sessão atual)</h2>
          {topPagesData.length > 0 ? (
            <div className="mt-4">
              <VisitsBarChart data={topPagesData} color="#15130f" valueLabel="Visitas" />
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-500">
              Ainda não há dados suficientes. Navegue pela loja para gerar visitas de exemplo.
            </p>
          )}
        </div>

        <div className="border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Origem do tráfego (ilustrativo)</h2>
          <div className="mt-4">
            <VisitsBarChart data={trafficData} color="#b8863e" valueLabel="Visitas" />
          </div>
        </div>
      </div>
    </div>
  );
}
