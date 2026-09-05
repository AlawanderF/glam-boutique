import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import type { Product } from '@/types';

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  return (product: Product, options: { colorName?: string; sizeLabel?: string; quantity?: number } = {}) => {
    addItem(product, options);
    showToast({
      type: 'success',
      message: 'Produto adicionado ao carrinho',
      description: product.name,
    });
  };
}
