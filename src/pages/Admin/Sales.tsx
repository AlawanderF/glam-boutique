import { useState, useEffect } from 'react';
import { SalesChart } from '@/components/admin/SalesChart';
import { dailySales as mockDailySales, topSellingProducts as mockTopProducts } from '@/constants/salesData';
import { mockOrders } from '@/constants/orders';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { formatCurrency, classNames } from '@/utils/format';
import type { DailySalesPoint } from '@/types/admin';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

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

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  processando: { bg: 'bg-gold-100', text: 'text-gold-700' },
  enviado: { bg: 'bg-blue-100', text: 'text-blue-700' },
  entregue: { bg: 'bg-success/10', text: 'text-success' },
  cancelado: { bg: 'bg-danger/10', text: 'text-danger' },
};

const ORDERS_PER_PAGE = 20;

interface SalesData {
  daily: DailySalesPoint[];
  orders: OrderApi[];
  topProducts: TopProductApi[];
  loading: boolean;
}

interface OrderApi {
  id: string;
  number: string;
  createdAt: string;
  status: string;
  total: number;
}

interface TopProductApi {
  name: string;
  revenue: number;
  unitsSold: number;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse border border-ink-200 bg-cream-50 p-5">
      <div className="h-3 w-24 rounded bg-ink-200" />
      <div className="mt-3 h-8 w-32 rounded bg-ink-200" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="animate-pulse border border-ink-200 bg-cream-50 p-6">
      <div className="h-5 w-40 rounded bg-ink-200" />
      <div className="mt-4 h-64 rounded bg-ink-200" />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="animate-pulse border border-ink-200 bg-cream-50 p-6">
      <div className="h-5 w-32 rounded bg-ink-200" />
      <div className="mt-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-ink-100 pb-3">
            <div>
              <div className="h-4 w-20 rounded bg-ink-200" />
              <div className="mt-1 h-3 w-28 rounded bg-ink-200" />
            </div>
            <div className="h-4 w-16 rounded bg-ink-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sales() {
  const [rangeDays, setRangeDays] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesData, setSalesData] = useState<SalesData>({
    daily: [],
    orders: [],
    topProducts: [],
    loading: true,
  });

  const token = useAdminAuthStore((s) => s.token);
  const isAuthenticated = useAdminAuthStore((s) => s.isAdminAuthenticated);

  useEffect(() => {
    async function fetchSales() {
      if (!isAuthenticated || !token || !API_URL) {
        setSalesData((s) => ({ ...s, loading: false }));
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [dailyRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/api/sales/daily?days=${rangeDays}`, { headers }),
          fetch(`${API_URL}/api/sales/orders?limit=50`, { headers }),
          fetch(`${API_URL}/api/sales/top-products`, { headers }),
        ]);

        if (!dailyRes.ok || !ordersRes.ok || !productsRes.ok) {
          throw new Error('API request failed');
        }

        const [daily, orders, topProducts] = await Promise.all([
          dailyRes.json() as Promise<DailySalesPoint[]>,
          ordersRes.json() as Promise<OrderApi[]>,
          productsRes.json() as Promise<TopProductApi[]>,
        ]);

        setSalesData({ daily, orders, topProducts, loading: false });
      } catch {
        setSalesData((s) => ({ ...s, loading: false }));
      }
    }

    fetchSales();
  }, [rangeDays, token, isAuthenticated]);

  // Fallback to mock data if API returns empty
  const displayDaily = salesData.daily.length > 0 ? salesData.daily : mockDailySales.slice(-rangeDays);
  const displayOrders = salesData.orders.length > 0 ? salesData.orders : mockOrders;
  const displayTopProducts =
    salesData.topProducts.length > 0
      ? salesData.topProducts
      : mockTopProducts;

  // Calculate metrics
  const periodRevenue = displayDaily.reduce((s, d) => s + d.revenue, 0);
  const periodOrders = displayDaily.reduce((s, d) => s + d.orders, 0);
  const avgTicket = periodOrders > 0 ? periodRevenue / periodOrders : 0;

  // Pagination
  const totalPages = Math.ceil(displayOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = displayOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (salesData.loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow">Desempenho comercial</span>
            <h1 className="mt-1 font-display text-3xl text-ink-900">Vendas</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonList />
          <SkeletonList />
        </div>
      </div>
    );
  }

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
              onClick={() => {
                setRangeDays(opt.days);
                setCurrentPage(1);
              }}
              className={classNames(
                'rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition-colors',
                rangeDays === opt.days
                  ? 'bg-ink-900 text-cream-50'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Receita no período
          </span>
          <p className="mt-2 font-display text-2xl text-ink-900">{formatCurrency(periodRevenue)}</p>
        </div>
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Pedidos no período
          </span>
          <p className="mt-2 font-display text-2xl text-ink-900">{periodOrders}</p>
        </div>
        <div className="border border-ink-200 bg-cream-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Ticket médio
          </span>
          <p className="mt-2 font-display text-2xl text-ink-900">{formatCurrency(avgTicket)}</p>
        </div>
      </div>

      <div className="border border-ink-200 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Receita por dia</h2>
        <div className="mt-4">
          <SalesChart data={displayDaily} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Pedidos recentes</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {paginatedOrders.map((order) => {
              const orderNumber = 'number' in order ? order.number : order.id;
              const orderDate = 'date' in order ? order.date : order.createdAt;
              const orderStatus = order.status.toLowerCase();
              const statusStyle = STATUS_STYLES[orderStatus] ?? { bg: 'bg-ink-100', text: 'text-ink-600' };

              return (
                <li
                  key={order.id}
                  className="flex items-center justify-between border-b border-ink-100 pb-3 text-sm last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink-900">#{orderNumber}</p>
                      <span
                        className={classNames(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          statusStyle.bg,
                          statusStyle.text
                        )}
                      >
                        {STATUS_LABELS[orderStatus] ?? orderStatus}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {new Date(orderDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      às{' '}
                      {new Date(orderDate).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="ml-4 font-display text-base text-ink-900">
                    {formatCurrency(order.total)}
                  </span>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
              <p className="text-xs text-ink-500">
                Mostrando {(currentPage - 1) * ORDERS_PER_PAGE + 1} -{' '}
                {Math.min(currentPage * ORDERS_PER_PAGE, displayOrders.length)} de {displayOrders.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={classNames(
                      'rounded px-2 py-1 text-xs font-medium',
                      currentPage === i + 1
                        ? 'bg-ink-900 text-cream-50'
                        : 'text-ink-600 hover:bg-ink-100'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border border-ink-200 bg-cream-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Mais vendidos</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {displayTopProducts.map((product, index) => (
              <li
                key={product.name}
                className="flex items-center justify-between border-b border-ink-100 pb-3 text-sm last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={classNames(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      index === 0
                        ? 'bg-gold-500 text-ink-950'
                        : index === 1
                          ? 'bg-ink-300 text-ink-950'
                          : index === 2
                            ? 'bg-gold-200 text-ink-950'
                            : 'bg-ink-100 text-ink-500'
                    )}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-500">{product.unitsSold} unidades</p>
                  </div>
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
