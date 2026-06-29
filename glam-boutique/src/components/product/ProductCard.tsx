import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { Rating } from '@/components/ui/Rating';
import { ProductBadgePill, DiscountPill } from '@/components/ui/Badge';
import { calculateDiscount, classNames, formatCurrency } from '@/utils/format';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { ROUTES } from '@/constants';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToCart = useAddToCart();
  const { toggleFavorite, isFavorite } = useFavoriteToggle();
  const favorite = isFavorite(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      colorName: product.colors[0]?.name,
      sizeLabel: product.sizes.find((s) => s.inStock)?.label,
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <Link to={ROUTES.product(product.slug)} className="relative block overflow-hidden bg-ink-100" aria-label={product.name}>
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {!imageLoaded && <div className="skeleton absolute inset-0" />}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={classNames(
              'h-full w-full object-cover transition-opacity duration-500 ease-luxe group-hover:opacity-0',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 ease-luxe group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.badges?.slice(0, 2).map((b) => <ProductBadgePill key={b} badge={b} />)}
          </div>
          {discount > 0 && (
            <div className="absolute right-3 top-3">
              <DiscountPill percent={discount} />
            </div>
          )}

          {/* Ações rápidas */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-2 p-3 transition-transform duration-400 ease-luxe group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className="flex items-center justify-center gap-2 bg-ink-900 py-3 text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-gold-500 hover:text-ink-950"
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Adicionar
            </button>
          </div>

          <button
            onClick={handleFavorite}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favorite}
            className="absolute right-3 bottom-3 rounded-full bg-cream-50/95 p-2.5 text-ink-700 shadow-soft transition-all hover:text-danger sm:bottom-3 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Heart className={classNames('h-4 w-4', favorite && 'fill-danger text-danger')} />
          </button>
          <button
            onClick={handleQuickView}
            aria-label={`Visualização rápida de ${product.name}`}
            className="absolute left-3 bottom-3 rounded-full bg-cream-50/95 p-2.5 text-ink-700 shadow-soft transition-all hover:text-ink-900 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="mt-3.5 flex flex-1 flex-col">
        <p className="text-2xs font-semibold uppercase tracking-wider text-ink-400">{product.brand}</p>
        <Link to={ROUTES.product(product.slug)}>
          <h3 className="mt-0.5 line-clamp-2 font-display text-[15px] leading-snug text-ink-900 transition-colors group-hover:text-gold-700">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5">
          <Rating value={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-base text-ink-900">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
