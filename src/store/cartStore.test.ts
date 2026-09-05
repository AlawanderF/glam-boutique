import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 'prod-1',
  slug: 'vestido-teste',
  sku: 'SKU-001',
  name: 'Vestido Teste',
  shortDescription: 'Test',
  description: 'Test description',
  brand: 'Glam',
  price: 100,
  compareAtPrice: 120,
  images: ['img.jpg'],
  stock: 5,
  categoryId: 'cat-1',
  rating: 4.5,
  reviewCount: 10,
  colors: [{ id: 'c1', name: 'Preto', hex: '#000' }],
  sizes: [{ id: 's1', label: 'M', inStock: true }],
  gender: 'feminino',
  tags: ['novo'],
  createdAt: '2026-01-01',
  currency: 'BRL',
  salesCount: 0,
};

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adiciona item novo', () => {
    useCartStore.getState().addItem(mockProduct, { quantity: 2 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('incrementa quantity de item existente', () => {
    useCartStore.getState().addItem(mockProduct, { quantity: 1 });
    useCartStore.getState().addItem(mockProduct, { quantity: 2 });
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('respeita maxStock', () => {
    useCartStore.getState().addItem(mockProduct, { quantity: 5 });
    useCartStore.getState().addItem(mockProduct, { quantity: 10 });
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('remove item', () => {
    useCartStore.getState().addItem(mockProduct, { quantity: 1 });
    const lineId = useCartStore.getState().items[0].id;
    useCartStore.getState().removeItem(lineId);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('aplica cupom válido', () => {
    const ok = useCartStore.getState().applyCoupon('GLAM10');
    expect(ok).toBe(true);
    expect(useCartStore.getState().couponDiscountPercent).toBe(10);
  });

  it('rejeita cupom inválido', () => {
    expect(useCartStore.getState().applyCoupon('INVALID')).toBe(false);
  });

  it('calcula total com desconto', () => {
    useCartStore.getState().addItem(mockProduct, { quantity: 2 });
    useCartStore.getState().applyCoupon('GLAM10');
    expect(useCartStore.getState().subtotal()).toBe(200);
    expect(useCartStore.getState().discountAmount()).toBe(20);
    expect(useCartStore.getState().total()).toBe(180);
  });

  it('clearCart remove tudo', () => {
    useCartStore.getState().addItem(mockProduct, { quantity: 1 });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().couponCode).toBeNull();
  });
});
