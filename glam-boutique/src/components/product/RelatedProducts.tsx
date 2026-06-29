import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface RelatedProductsProps {
  title: string;
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export function RelatedProducts({ title, products, onQuickView }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="container-app py-14">
      <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
}
