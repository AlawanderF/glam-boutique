import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { ROUTES } from '@/constants';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = useAuthStore((s) => s.registerUser);
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido.';
    if (password.length < 6) newErrors.password = 'A senha deve ter ao menos 6 caracteres.';
    if (!acceptedTerms) newErrors.terms = 'Você precisa aceitar os termos para continuar.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    await registerUser(name, email, password);
    setIsLoading(false);
    showToast({
      type: 'success',
      message: 'Conta criada com sucesso!',
      description: 'Você ganhou 10% OFF na primeira compra.',
    });
    navigate(ROUTES.account);
  };

  return (
    <AuthLayout title="Criar minha conta" subtitle="Cadastre-se e ganhe 10% OFF na primeira compra.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          label="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Seu nome completo"
        />
        <FormField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="seuemail@exemplo.com"
        />
        <FormField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Mínimo de 6 caracteres"
        />

        <label className="flex items-start gap-2.5 text-xs text-ink-600">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms((v) => !v)}
            className="mt-0.5 h-3.5 w-3.5 text-ink-900 focus:ring-gold-500"
          />
          Li e aceito os{' '}
          <Link to={ROUTES.termsOfUse} target="_blank" className="link-underline font-medium text-ink-700">
            Termos de Uso
          </Link>{' '}
          e a{' '}
          <Link to={ROUTES.privacyPolicy} target="_blank" className="link-underline font-medium text-ink-700">
            Política de Privacidade
          </Link>{' '}
          da Glam Boutique.
        </label>
        {errors.terms && <p role="alert" className="text-xs text-danger">{errors.terms}</p>}

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Criar minha conta
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-2xs uppercase tracking-wider text-ink-400">ou cadastre-se com</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <SocialLoginButtons />

      <p className="mt-7 text-center text-sm text-ink-600">
        Já tem uma conta?{' '}
        <Link to={ROUTES.login} className="link-underline font-semibold text-ink-900">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
