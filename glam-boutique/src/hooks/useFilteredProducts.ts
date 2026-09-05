import { useMemo } from 'react';
import type { Product, SortOption, Gender } from '@/types';

export interface CatalogFilterState {
  categorySlugs: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  genders: Gender[];
  priceRange: [number, number];
  minRating: number | null;
  onlyInStock: boolean;
  sort: SortOption;
  search: string;
}

export const DEFAULT_FILTERS: CatalogFilterState = {
  categorySlugs: [],
  brands: [],
  colors: [],
  sizes: [],
  genders: [],
  priceRange: [0, 1000],
  minRating: null,
  onlyInStock: false,
  sort: 'relevancia',
  search: '',
};

export function useFilteredProducts(
  products: Product[],
  categoryIdBySlug: Record<string, string>,
  filters: CatalogFilterState
) {
  return useMemo(() => {
    let result = [...products];

    if (filters.categorySlugs.length > 0) {
      const ids = filters.categorySlugs.map((slug) => categoryIdBySlug[slug]).filter(Boolean);
      result = result.filter((p) => ids.includes(p.categoryId));
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)));
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s.label) && s.inStock));
    }

    if (filters.genders.length > 0) {
      result = result.filter((p) => filters.genders.includes(p.gender));
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.minRating) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters.onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.tags?.some((t) => t.toLowerCase().includes(term))
      );
    }

    switch (filters.sort) {
      case 'mais-vendidos':
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'menor-preco':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'maior-preco':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'melhor-avaliacao':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'mais-recentes':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [products, categoryIdBySlug, filters]);
}
