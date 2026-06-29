import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { ROUTES } from '@/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? ROUTES.account;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      showToast({ type: 'success', message: 'Login realizado com sucesso!' });
      navigate(redirectTo);
    } else {
      setError(result.message ?? 'Não foi possível entrar. Tente novamente.');
    }
  };

  return (
    <AuthLayout title="Entrar na sua conta" subtitle="Acesse para acompanhar pedidos e favoritos.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
        />
        <div className="relative">
          <FormField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-9 text-ink-400 hover:text-ink-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-ink-600">
            <input type="checkbox" className="h-3.5 w-3.5 text-ink-900 focus:ring-gold-500" />
            Lembrar de mim
          </label>
          <Link to={ROUTES.forgotPassword} className="link-underline text-xs font-semibold text-ink-700">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Entrar
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-2xs uppercase tracking-wider text-ink-400">ou continue com</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <SocialLoginButtons />

      <p className="mt-7 text-center text-sm text-ink-600">
        Ainda não tem conta?{' '}
        <Link to={ROUTES.register} className="link-underline font-semibold text-ink-900">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
}
