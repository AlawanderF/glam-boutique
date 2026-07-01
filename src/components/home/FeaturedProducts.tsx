import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  getBestSellers,
  getNewArrivals,
  getOnSale,
  getTopRated,
  products as allProducts,
} from '@/constants/products';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { ROUTES } from '@/constants';
import type { Product } from '@/types';
import { classNames } from '@/utils/format';

type TabKey = 'mais-vendidos' | 'lancamentos' | 'tendencias' | 'recomendados' | 'promocoes';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'mais-vendidos', label: 'Mais vendidos' },
  { key: 'lancamentos', label: 'Lançamentos' },
  { key: 'tendencias', label: 'Tendências' },
  { key: 'recomendados', label: 'Recomendados' },
  { key: 'promocoes', label: 'Promoções' },
];

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>('mais-vendidos');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const productsForTab = useMemo(() => {
    switch (activeTab) {
      case 'mais-vendidos':
        return getBestSellers().slice(0, 8);
      case 'lancamentos':
        return getNewArrivals().slice(0, 8);
      case 'tendencias':
        return [...allProducts].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 8);
      case 'recomendados':
        return getTopRated().slice(0, 8);
      case 'promocoes':
        return getOnSale().slice(0, 8);
      default:
        return allProducts.slice(0, 8);
    }
  }, [activeTab]);

  return (
    <section className="bg-cream-100/60 py-16 sm:py-24">
      <div className="container-app">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">Selecionados para você</span>
          <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">Produtos em destaque</h2>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist" aria-label="Filtrar produtos em destaque">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={classNames(
                'rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300',
                activeTab === tab.key
                  ? 'bg-ink-900 text-cream-50 shadow-soft'
                  : 'bg-transparent text-ink-500 hover:text-ink-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
          >
            {productsForTab.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-center">
          <Link
            to={ROUTES.catalog}
            className="flex items-center gap-2 border-b border-ink-900 pb-1 text-sm font-semibold uppercase tracking-wide text-ink-900 hover:text-gold-700 hover:border-gold-700"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
