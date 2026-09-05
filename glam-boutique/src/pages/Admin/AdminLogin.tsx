import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { ADMIN_ROUTES } from '@/constants/admin';
import { BRAND } from '@/constants';

export default function AdminLogin() {
  const { isAdminAuthenticated, mode, login } = useAdminAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? ADMIN_ROUTES.dashboard;

  if (isAdminAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      navigate(redirectTo);
    } else {
      setError(result.message ?? 'Não foi possível entrar.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-sm bg-cream-50 p-8 shadow-elevated"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-gold-400">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-2xl text-ink-900">Painel administrativo</h1>
          <p className="mt-1 text-sm text-ink-500">{BRAND.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
          <FormField
            label="E-mail administrativo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@glamboutique.com.br"
            autoComplete="username"
          />
          <FormField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Entrar no painel
          </Button>
        </form>

        <p className="mt-6 flex items-center gap-2 text-2xs text-ink-400">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-600" />
          {mode === 'demo'
            ? 'Acesso restrito à equipe da Glam Boutique. Demo: admin@glamboutique.com.br / glamadmin123'
            : 'Acesso restrito à equipe da Glam Boutique.'}
        </p>
      </motion.div>
    </div>
  );
}
