import { useWishlistStore } from '@/store/wishlistStore';
import { useToastStore } from '@/store/toastStore';
import type { Product } from '@/types';

export function useFavoriteToggle() {
  const toggle = useWishlistStore((s) => s.toggle);
  const isFavorite = useWishlistStore((s) => s.isFavorite);
  const showToast = useToastStore((s) => s.show);

  const toggleFavorite = (product: Product) => {
    const wasFavorite = isFavorite(product.id);
    toggle(product.id);
    showToast({
      type: 'info',
      message: wasFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      description: product.name,
    });
  };

  return { toggleFavorite, isFavorite };
}
