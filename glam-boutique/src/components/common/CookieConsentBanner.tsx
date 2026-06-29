import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { useCookieConsentStore } from '@/store/cookieConsentStore';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export function CookieConsentBanner() {
  const { consent, setConsent } = useCookieConsentStore();

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Aviso de cookies"
          className="fixed inset-x-4 bottom-4 z-[95] mx-auto flex max-w-3xl flex-col gap-4 rounded-sm border border-ink-200 bg-cream-50 p-5 shadow-elevated sm:flex-row sm:items-center sm:gap-6"
        >
          <Cookie className="hidden h-6 w-6 flex-shrink-0 text-gold-600 sm:block" aria-hidden="true" />
          <p className="flex-1 text-sm text-ink-600">
            Usamos cookies essenciais para o funcionamento da loja (carrinho, login) e, com seu consentimento,
            cookies de analytics para entender como você navega. Saiba mais na nossa{' '}
            <Link to={ROUTES.privacyPolicy} className="link-underline font-medium text-ink-900">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="flex flex-shrink-0 gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConsent('essential-only')}>
              Só essenciais
            </Button>
            <Button variant="primary" size="sm" onClick={() => setConsent('accepted')}>
              Aceitar todos
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
