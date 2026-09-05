import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { Button } from '@/components/ui/Button';
import type { CatalogFilterState } from '@/hooks/useFilteredProducts';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CatalogFilterState;
  onChange: (filters: CatalogFilterState) => void;
  onClear: () => void;
  resultCount: number;
}

export function MobileFilterDrawer({ isOpen, onClose, filters, onChange, onClear, resultCount }: MobileFilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink-950/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros de produtos"
            className="fixed left-0 top-0 z-[85] flex h-full w-full max-w-sm flex-col bg-cream-50 shadow-elevated"
          >
            <div className="flex items-center justify-between border-b border-ink-200 p-5">
              <span className="font-display text-lg text-ink-900">Filtros</span>
              <button onClick={onClose} aria-label="Fechar filtros">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar filters={filters} onChange={onChange} onClear={onClear} />
            </div>
            <div className="border-t border-ink-200 p-5">
              <Button variant="primary" fullWidth onClick={onClose}>
                Ver {resultCount} resultados
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
