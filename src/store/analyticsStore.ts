import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PageView } from '@/types/admin';

interface AnalyticsState {
  pageViews: PageView[];
  recordPageView: (path: string) => void;
  getTotalViews: () => number;
  getUniqueSessions: () => number;
  getViewsByPath: () => { path: string; count: number }[];
}

const MAX_STORED_VIEWS = 2000;

function getSessionId(): string {
  const existing = sessionStorage.getItem('glam-boutique-session-id');
  if (existing) return existing;
  const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem('glam-boutique-session-id', id);
  return id;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      pageViews: [],

      recordPageView: (path) => {
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        const sessionId = getSessionId();
        const view: PageView = {
          id: `${sessionId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          path,
          timestamp: new Date().toISOString(),
          device: isMobile ? 'mobile' : 'desktop',
          referrer: typeof document !== 'undefined' ? (document.referrer || 'direto') : 'direto',
          sessionId,
        };
        set((state) => ({
          pageViews: [...state.pageViews, view].slice(-MAX_STORED_VIEWS),
        }));
      },

      getTotalViews: () => get().pageViews.length,

      getUniqueSessions: () => new Set(get().pageViews.map((v) => v.sessionId)).size,

      getViewsByPath: () => {
        const counts = new Map<string, number>();
        for (const view of get().pageViews) {
          counts.set(view.path, (counts.get(view.path) ?? 0) + 1);
        }
        return Array.from(counts.entries())
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count);
      },
    }),
    { name: 'glam-boutique-analytics' }
  )
);
