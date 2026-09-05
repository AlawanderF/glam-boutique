import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalyticsStore } from '@/store/analyticsStore';

export function VisitTracker() {
  const location = useLocation();
  const { sessionId, recordPageView } = useAnalyticsStore();

  useEffect(() => {
    // Enviar pageview para o backend
    recordPageView({
      sessionId,
      path: location.pathname,
      device: /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      referrer: document.referrer || undefined,
    });
  }, [location.pathname, sessionId, recordPageView]);

  return null;
}
