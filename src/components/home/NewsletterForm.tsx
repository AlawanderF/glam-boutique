import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { classNames } from '@/utils/format';

interface NewsletterFormProps {
  variant?: 'light' | 'dark';
  showNameField?: boolean;
}

export function NewsletterForm({ variant = 'light', showNameField = false }: NewsletterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isDark = variant === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError('');
    // Em produção: enviar para services/newsletterService.ts (integração com ESP/CRM)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={classNames(
          'mt-4 flex items-center gap-2 rounded-sm border px-4 py-3 text-sm',
          isDark ? 'border-success/40 text-cream-100' : 'border-success/30 text-ink-700'
        )}
      >
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" />
        Cadastro confirmado! Seu cupom de 10% OFF foi enviado por e-mail.
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3" noValidate>
      {showNameField && (
        <label className="sr-only" htmlFor="newsletter-name">
          Nome
        </label>
      )}
      {showNameField && (
        <input
          id="newsletter-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className={classNames(
            'flex-1 border bg-transparent px-4 py-3 text-sm placeholder:text-ink-400 focus:outline-none',
            isDark ? 'border-ink-700 text-cream-50' : 'border-ink-300 text-ink-900'
          )}
        />
      )}
      <div className="flex flex-1 flex-col">
        <label className="sr-only" htmlFor="newsletter-email">
          E-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className={classNames(
            'border bg-transparent px-4 py-3 text-sm placeholder:text-ink-400 focus:outline-none focus:border-gold-500',
            isDark ? 'border-ink-700 text-cream-50' : 'border-ink-300 text-ink-900'
          )}
        />
        {error && (
          <span id="newsletter-error" role="alert" className="mt-1 text-2xs text-danger">
            {error}
          </span>
        )}
      </div>
      <button
        type="submit"
        className={classNames(
          'flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors',
          isDark ? 'bg-gold-500 text-ink-950 hover:bg-gold-400' : 'bg-ink-900 text-cream-50 hover:bg-ink-800'
        )}
      >
        Cadastrar
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
