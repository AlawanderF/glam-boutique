import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  couponDiscountPercent: number;
  addItem: (product: Product, options: { colorName?: string; sizeLabel?: string; quantity?: number }) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  discountAmount: () => number;
  total: () => number;
}

const VALID_COUPONS: Record<string, number> = {
  GLAM10: 10,
  BEMVINDA15: 15,
  GLAMVIP20: 20,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      couponDiscountPercent: 0,

      addItem: (product, options) => {
        const lineId = `${product.id}-${options.colorName ?? 'default'}-${options.sizeLabel ?? 'default'}`;
        const quantity = options.quantity ?? 1;

        set((state) => {
          const existing = state.items.find((i) => i.id === lineId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === lineId
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock) }
                  : i
              ),
            };
          }
          const newItem: CartItem = {
            id: lineId,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            colorName: options.colorName,
            sizeLabel: options.sizeLabel,
            quantity,
            maxStock: product.stock,
          };
          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== lineId) })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === lineId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) } : i
          ),
        })),

      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        const discount = VALID_COUPONS[normalized];
        if (discount) {
          set({ couponCode: normalized, couponDiscountPercent: discount });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscountPercent: 0 }),

      clearCart: () => set({ items: [], couponCode: null, couponDiscountPercent: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      discountAmount: () => (get().subtotal() * get().couponDiscountPercent) / 100,
      total: () => get().subtotal() - get().discountAmount(),
    }),
    {
      name: 'glam-boutique-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscountPercent: state.couponDiscountPercent,
      }),
    }
  )
);
