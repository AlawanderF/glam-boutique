import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useCookieConsentStore } from '@/store/cookieConsentStore';

/**
 * Registra uma "page view" real (no navegador atual) a cada troca de rota —
 * apenas quando o visitante consentiu com cookies de analytics (LGPD).
 * Nota: como é um registro client-side em localStorage, reflete apenas visitas
 * deste navegador. Para analytics multi-usuário de verdade, ver server/ (MySQL).
 */
export function VisitTracker() {
  const { pathname } = useLocation();
  const recordPageView = useAnalyticsStore((s) => s.recordPageView);
  const consent = useCookieConsentStore((s) => s.consent);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== 'accepted') return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    recordPageView(pathname);
  }, [pathname, recordPageView, consent]);

  return null;
}
