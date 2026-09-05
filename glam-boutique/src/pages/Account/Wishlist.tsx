import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/store/wishlistStore';
import { products } from '@/constants/products';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import type { Product } from '@/types';

export default function Wishlist() {
  const productIds = useWishlistStore((s) => s.productIds);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const favoriteProducts = products.filter((p) => productIds.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-ink-200 py-20 text-center">
        <Heart className="h-10 w-10 text-ink-300" />
        <p className="mt-3 text-sm text-ink-500">Sua lista de desejos está vazia.</p>
        <Link to={ROUTES.catalog} className="mt-5">
          <Button variant="primary" size="sm">
            Explorar produtos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
        {favoriteProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
