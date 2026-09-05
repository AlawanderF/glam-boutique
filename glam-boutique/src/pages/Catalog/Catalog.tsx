import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '@/constants/products';
import { categories } from '@/constants/categories';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { MobileFilterDrawer } from '@/components/catalog/MobileFilterDrawer';
import { SortDropdown } from '@/components/catalog/SortDropdown';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { useFilteredProducts, DEFAULT_FILTERS, type CatalogFilterState } from '@/hooks/useFilteredProducts';
import { useDebouncedLoading } from '@/hooks/useDebouncedLoading';
import type { Product } from '@/types';
import { classNames } from '@/utils/format';

const categoryIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
const PAGE_SIZE = 12;

export default function Catalog() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('busca') ?? '';
  const routeKey = `${categorySlug ?? ''}|${searchTerm}`;

  const [filters, setFilters] = useState<CatalogFilterState>({
    ...DEFAULT_FILTERS,
    categorySlugs: categorySlug ? [categorySlug] : [],
    search: searchTerm,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  // Ajuste de estado durante a renderização (sem useEffect) quando a rota muda:
  // evita o re-render em cascata de sincronizar via efeito, conforme recomendação do React.
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    setFilters((f) => ({ ...f, categorySlugs: categorySlug ? [categorySlug] : [], search: searchTerm }));
    setPage(1);
  }

  const isLoading = useDebouncedLoading(filters, 420);

  const filtered = useFilteredProducts(products, categoryIdBySlug, filters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  const activeFilterChips = [
    ...filters.categorySlugs.map((slug) => ({
      key: `cat-${slug}`,
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      onRemove: () => setFilters((f) => ({ ...f, categorySlugs: f.categorySlugs.filter((s) => s !== slug) })),
    })),
    ...filters.brands.map((b) => ({
      key: `brand-${b}`,
      label: b,
      onRemove: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })),
    })),
    ...filters.colors.map((c) => ({
      key: `color-${c}`,
      label: c,
      onRemove: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
    })),
    ...filters.sizes.map((s) => ({
      key: `size-${s}`,
      label: `Tam. ${s}`,
      onRemove: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })),
    })),
  ];

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <span className="eyebrow">{currentCategory ? currentCategory.name : 'Catálogo'}</span>
        <h1 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">
          {searchTerm
            ? `Resultados para "${searchTerm}"`
            : currentCategory
            ? currentCategory.name
            : 'Todos os produtos'}
        </h1>
        {currentCategory?.description && (
          <p className="mt-2 max-w-lg text-sm text-ink-500">{currentCategory.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            onClear={() => setFilters({ ...DEFAULT_FILTERS, categorySlugs: categorySlug ? [categorySlug] : [] })}
          />
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-4">
            <p className="text-sm text-ink-500">
              <strong className="text-ink-900">{filtered.length}</strong> produtos encontrados
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 border border-ink-300 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-ink-700 lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtros
              </button>
              <SortDropdown
                value={filters.sort}
                onChange={(sort) => setFilters((f) => ({ ...f, sort }))}
              />
            </div>
          </div>

          {/* Chips de filtros ativos */}
          {activeFilterChips.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-xs text-ink-700 hover:bg-ink-200"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* Grid de produtos */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <p className="font-display text-xl text-ink-900">Nenhum produto encontrado</p>
              <p className="mt-2 text-sm text-ink-500">Tente ajustar os filtros ou buscar por outro termo.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {paginated.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}

          {/* Paginação */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  aria-current={page === i + 1}
                  className={classNames(
                    'h-9 w-9 rounded-full text-sm font-medium transition-colors',
                    page === i + 1 ? 'bg-ink-900 text-cream-50' : 'text-ink-600 hover:bg-ink-100'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ ...DEFAULT_FILTERS, categorySlugs: categorySlug ? [categorySlug] : [] })}
        resultCount={filtered.length}
      />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
