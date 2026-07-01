import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_HISTORY = 8;

interface SearchHistoryState {
  history: string[];
  addSearch: (term: string) => void;
  removeSearch: (term: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addSearch: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        set((state) => ({
          // Move para o topo se já existir, senão adiciona; limita ao máximo
          history: [trimmed, ...state.history.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY),
        }));
      },
      removeSearch: (term) =>
        set((state) => ({ history: state.history.filter((h) => h !== term) })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'glam-boutique-search-history' }
  )
);
