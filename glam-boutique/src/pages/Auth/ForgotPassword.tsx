import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError('');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu e-mail e enviaremos as instruções de recuperação."
    >
      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-sm border border-ink-200 bg-ink-50/50 p-6 text-center"
        >
          <MailCheck className="h-8 w-8 text-success" />
          <p className="text-sm text-ink-700">
            Se houver uma conta associada a <strong>{email}</strong>, você receberá um e-mail com as instruções
            em poucos minutos.
          </p>
          <Link to={ROUTES.login} className="link-underline text-sm font-semibold text-ink-900">
            Voltar para o login
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="seuemail@exemplo.com"
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Enviar instruções
          </Button>
          <Link to={ROUTES.login} className="link-underline text-center text-sm text-ink-600">
            Voltar para o login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
