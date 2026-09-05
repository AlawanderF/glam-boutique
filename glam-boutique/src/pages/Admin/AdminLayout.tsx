import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  BarChart3,
  CreditCard,
  LogOut,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { ADMIN_ROUTES } from '@/constants/admin';
import { ROUTES, BRAND } from '@/constants';
import { classNames } from '@/utils/format';

const NAV_ITEMS = [
  { to: ADMIN_ROUTES.dashboard, label: 'Visão geral', icon: LayoutDashboard },
  { to: ADMIN_ROUTES.sales, label: 'Vendas', icon: ShoppingCart },
  { to: ADMIN_ROUTES.expenses, label: 'Saídas', icon: Receipt },
  { to: ADMIN_ROUTES.analytics, label: 'Visitantes', icon: BarChart3 },
  { to: ADMIN_ROUTES.paymentMethods, label: 'Pagamentos', icon: CreditCard },
];

export default function AdminLayout() {
  const { isAdminAuthenticated, adminName, mode, logout } = useAdminAuthStore();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-ink-50/40">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-ink-200 bg-cream-50 lg:flex">
        <div className="border-b border-ink-200 p-6">
          <span className="font-display text-xl text-ink-900">{BRAND.name}</span>
          <p className="mt-0.5 text-2xs uppercase tracking-widest2 text-gold-600">Painel administrativo</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Navegação administrativa">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition-colors',
                  isActive ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-ink-100'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-200 p-4">
          <a
            href={ROUTES.home}
            className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-100"
          >
            <ExternalLink className="h-4 w-4" />
            Ver a loja
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-ink-500 hover:bg-ink-100 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-200 bg-cream-50 px-5 py-4 lg:px-8">
          <div className="flex gap-1 overflow-x-auto lg:hidden">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  classNames(
                    'flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-2xs font-semibold uppercase',
                    isActive ? 'bg-ink-900 text-cream-50' : 'bg-ink-100 text-ink-600'
                  )
                }
              >
                <item.icon className="h-3 w-3" />
                {item.label}
              </NavLink>
            ))}
          </div>
          <span className="hidden text-sm text-ink-500 lg:block">Bem-vindo(a), {adminName}</span>
          <span className="text-2xs text-ink-400">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}</span>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          {mode === 'demo' && (
            <div className="mb-6 flex items-start gap-3 border border-gold-300 bg-gold-50 p-4 text-sm text-ink-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-600" />
              <p>
                <strong>Modo demonstração:</strong> o backend (pasta <code>server/</code>) não está configurado, então
                este painel está usando dados locais e uma senha de demonstração. Antes de publicar o site, configure{' '}
                <code>VITE_API_URL</code> e rode o backend — veja <code>server/README.md</code>.
              </p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
