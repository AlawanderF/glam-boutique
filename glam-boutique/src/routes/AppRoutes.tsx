import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { PageLoader } from '@/components/common/PageLoader';

// Lazy loading de páginas para code-splitting e melhor performance (Lighthouse)
const Home = lazy(() => import('@/pages/Home/Home'));
const Catalog = lazy(() => import('@/pages/Catalog/Catalog'));
const ProductPage = lazy(() => import('@/pages/Product/Product'));
const Cart = lazy(() => import('@/pages/Cart/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout/Checkout'));
const AccountLayout = lazy(() => import('@/pages/Account/AccountLayout'));
const Profile = lazy(() => import('@/pages/Account/Profile'));
const Orders = lazy(() => import('@/pages/Account/Orders'));
const Wishlist = lazy(() => import('@/pages/Account/Wishlist'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const Register = lazy(() => import('@/pages/Auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'));
const PrivacyPolicy = lazy(() => import('@/pages/Legal/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('@/pages/Legal/TermsOfUse'));
const ExchangePolicy = lazy(() => import('@/pages/Legal/ExchangePolicy'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));

// Painel administrativo — carregado separadamente, fora do layout da loja
const AdminLogin = lazy(() => import('@/pages/Admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminSales = lazy(() => import('@/pages/Admin/Sales'));
const AdminExpenses = lazy(() => import('@/pages/Admin/Expenses'));
const AdminAnalytics = lazy(() => import('@/pages/Admin/Analytics'));
const AdminPaymentMethods = lazy(() => import('@/pages/Admin/PaymentMethods'));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'catalogo', element: withSuspense(<Catalog />) },
      { path: 'catalogo/:categorySlug', element: withSuspense(<Catalog />) },
      { path: 'produto/:slug', element: withSuspense(<ProductPage />) },
      { path: 'carrinho', element: withSuspense(<Cart />) },
      { path: 'checkout', element: withSuspense(<Checkout />) },
      { path: 'entrar', element: withSuspense(<Login />) },
      { path: 'cadastro', element: withSuspense(<Register />) },
      { path: 'recuperar-senha', element: withSuspense(<ForgotPassword />) },
      { path: 'privacidade', element: withSuspense(<PrivacyPolicy />) },
      { path: 'termos', element: withSuspense(<TermsOfUse />) },
      { path: 'trocas', element: withSuspense(<ExchangePolicy />) },
      {
        path: 'conta',
        element: withSuspense(<AccountLayout />),
        children: [
          { index: true, element: withSuspense(<Profile />) },
          { path: 'perfil', element: withSuspense(<Profile />) },
          { path: 'pedidos', element: withSuspense(<Orders />) },
          { path: 'favoritos', element: withSuspense(<Wishlist />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: 'admin',
    children: [
      { path: 'entrar', element: withSuspense(<AdminLogin />) },
      {
        element: withSuspense(<AdminLayout />),
        children: [
          { index: true, element: withSuspense(<AdminDashboard />) },
          { path: 'vendas', element: withSuspense(<AdminSales />) },
          { path: 'saidas', element: withSuspense(<AdminExpenses />) },
          { path: 'visitantes', element: withSuspense(<AdminAnalytics />) },
          { path: 'pagamentos', element: withSuspense(<AdminPaymentMethods />) },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
