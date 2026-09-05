import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilteredProducts, DEFAULT_FILTERS } from '@/hooks/useFilteredProducts';
import type { Product } from '@/types';

const mockProduct = (
  overrides: Partial<Product> = {}
): Product => ({
  id: '1',
  name: 'Camiseta Teste',
  slug: 'camiseta-teste',
  brand: 'Marca X',
  price: 100,
  originalPrice: 150,
  images: [],
  description: 'Descrição do produto',
  details: [],
  sizes: [{ label: 'M', inStock: true }],
  colors: [{ name: 'Preto', hex: '#000' }],
  stock: 10,
  categoryId: 'cat-1',
  gender: 'female',
  tags: [],
  rating: 4.5,
  salesCount: 50,
  createdAt: '2024-01-01',
  ...overrides,
});

const mockCategoryMap: Record<string, string> = {
  'roupas': 'cat-1',
};

describe('useFilteredProducts', () => {
  it('retorna todos os produtos quando não há filtros', () => {
    const products = [
      mockProduct({ id: '1' }),
      mockProduct({ id: '2' }),
    ];

    const { result } = renderHook(() =>
      useFilteredProducts(products, mockCategoryMap, DEFAULT_FILTERS)
    );

    expect(result.current).toHaveLength(2);
  });

  it('filtra por categoria via slug', () => {
    const products = [
      mockProduct({ id: '1', categoryId: 'cat-1' }),
      mockProduct({ id: '2', categoryId: 'cat-2' }),
    ];

    const { result } = renderHook(() =>
      useFilteredProducts(products, mockCategoryMap, {
        ...DEFAULT_FILTERS,
        categorySlugs: ['roupas'],
      })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('1');
  });

  it('filtra por faixa de preço', () => {
    const products = [
      mockProduct({ id: '1', price: 50 }),
      mockProduct({ id: '2', price: 150 }),
      mockProduct({ id: '3', price: 200 }),
    ];

    const { result } = renderHook(() =>
      useFilteredProducts(products, mockCategoryMap, {
        ...DEFAULT_FILTERS,
        priceRange: [100, 180],
      })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('2');
  });

  it('ordena por menor preço', () => {
    const products = [
      mockProduct({ id: '1', price: 200 }),
      mockProduct({ id: '2', price: 50 }),
      mockProduct({ id: '3', price: 100 }),
    ];

    const { result } = renderHook(() =>
      useFilteredProducts(products, mockCategoryMap, {
        ...DEFAULT_FILTERS,
        sort: 'menor-preco',
      })
    );

    expect(result.current[0].id).toBe('2');
    expect(result.current[1].id).toBe('3');
    expect(result.current[2].id).toBe('1');
  });

  it('filtra por termo de busca', () => {
    const products = [
      mockProduct({ id: '1', name: 'Camiseta Azul' }),
      mockProduct({ id: '2', name: 'Calça Jeans' }),
    ];

    const { result } = renderHook(() =>
      useFilteredProducts(products, mockCategoryMap, {
        ...DEFAULT_FILTERS,
        search: 'camis',
      })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('1');
  });

  it('filtra apenas produtos em estoque', () => {
    const products = [
      mockProduct({ id: '1', stock: 0 }),
      mockProduct({ id: '2', stock: 5 }),
    ];

    const { result } = renderHook(() =>
      useFilteredProducts(products, mockCategoryMap, {
        ...DEFAULT_FILTERS,
        onlyInStock: true,
      })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('2');
  });
});
