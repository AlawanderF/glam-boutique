import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { classNames } from '@/utils/format';

const NAV_ITEMS = [
  { to: ROUTES.accountProfile, label: 'Meu perfil', icon: User },
  { to: ROUTES.accountOrders, label: 'Meus pedidos', icon: Package },
  { to: ROUTES.accountWishlist, label: 'Lista de desejos', icon: Heart },
];

export default function AccountLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <span className="eyebrow">Minha conta</span>
        <h1 className="mt-2 font-display text-3xl text-ink-900">Olá, {user?.name}!</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1" aria-label="Navegação da conta">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
            <button
              onClick={logout}
              className="mt-2 flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-ink-500 hover:bg-ink-100 hover:text-danger"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
