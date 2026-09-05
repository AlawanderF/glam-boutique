import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';
import { ProductBadgePill } from '@/components/ui/Badge';
import { calculateDiscount, formatCurrency, installmentText } from '@/utils/format';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes.find((s) => s.inStock)?.label
  );
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleAdd = () => {
    addToCart(product, { colorName: selectedColor, sizeLabel: selectedSize, quantity });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Visualização rápida de ${product.name}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-sm bg-cream-50 shadow-elevated sm:grid-cols-2 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            aria-label="Fechar visualização rápida"
            className="absolute right-4 top-4 z-10 rounded-full bg-cream-50/90 p-2 text-ink-700 shadow-soft hover:text-ink-900"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="aspect-[3/4] w-full bg-ink-100">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="eyebrow">{product.brand}</p>
            <h2 className="mt-2 font-display text-2xl text-ink-900">{product.name}</h2>

            <div className="mt-2">
              <Rating value={product.rating} reviewCount={product.reviewCount} showValue />
            </div>

            {product.badges && product.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <ProductBadgePill key={b} badge={b} />
                ))}
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-2xl text-ink-900">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-semibold text-success">-{discount}%</span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-500">{installmentText(product.price)}</p>

            <p className="mt-4 text-sm leading-relaxed text-ink-600">{product.shortDescription}</p>

            {product.colors.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                  Cor: <span className="font-normal text-ink-500">{selectedColor}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={`Selecionar cor ${c.name}`}
                      aria-pressed={selectedColor === c.name}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? 'border-gold-500 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Tamanho</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => s.inStock && setSelectedSize(s.label)}
                      disabled={!s.inStock}
                      aria-pressed={selectedSize === s.label}
                      className={`min-w-[2.75rem] rounded-sm border px-3 py-2 text-xs font-medium transition-colors ${
                        selectedSize === s.label
                          ? 'border-ink-900 bg-ink-900 text-cream-50'
                          : s.inStock
                          ? 'border-ink-300 text-ink-700 hover:border-ink-900'
                          : 'border-ink-100 text-ink-300 line-through'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Quantidade</p>
              <div className="flex items-center rounded-sm border border-ink-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-ink-600 hover:text-ink-900"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-ink-600 hover:text-ink-900"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Button variant="primary" onClick={handleAdd}>
                Adicionar ao carrinho
              </Button>
              <Link
                to={ROUTES.product(product.slug)}
                onClick={onClose}
                className="link-underline text-center text-xs font-semibold uppercase tracking-wider text-ink-700"
              >
                Ver página completa do produto
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
