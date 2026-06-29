import { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShieldCheck, RotateCcw, Truck, ChevronRight } from 'lucide-react';
import { getProductBySlug, products } from '@/constants/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { Rating } from '@/components/ui/Rating';
import { ProductBadgePill } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { calculateDiscount, classNames, estimateDeliveryDate, formatCurrency, installmentText } from '@/utils/format';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { ROUTES } from '@/constants';
import { categories } from '@/constants/categories';
import type { Product } from '@/types';

export default function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes.find((s) => s.inStock)?.label
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'descricao' | 'avaliacoes'>('descricao');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const addToCart = useAddToCart();
  const { toggleFavorite, isFavorite } = useFavoriteToggle();
  const navigate = useNavigate();

  // Ajuste de estado durante a renderização (sem useEffect) quando o produto exibido muda
  // (ex.: navegação entre páginas de produtos diferentes via links de cross-sell).
  const [activeProductId, setActiveProductId] = useState(product?.id);
  if (product && product.id !== activeProductId) {
    setActiveProductId(product.id);
    setSelectedColor(product.colors[0]?.name);
    setSelectedSize(product.sizes.find((s) => s.inStock)?.label);
    setQuantity(1);
    setSizeError(false);
  }

  // Efeito legítimo: sincroniza com o sistema externo (rolagem do navegador).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  if (!slug) return <Navigate to={ROUTES.catalog} replace />;
  if (!product) {
    return (
      <div className="container-app flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl text-ink-900">Produto não encontrado</h1>
        <Link to={ROUTES.catalog} className="mt-4 link-underline text-sm font-semibold text-ink-700">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const category = categories.find((c) => c.id === product.categoryId);
  const favorite = isFavorite(product.id);

  const handleAddToCart = (buyNow = false) => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, { colorName: selectedColor, sizeLabel: selectedSize, quantity });
    if (buyNow) {
      navigate(ROUTES.cart);
    }
  };

  const similarProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  const alsoBought = products
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pb-16">
      {/* Breadcrumbs */}
      <div className="container-app flex items-center gap-1.5 py-5 text-xs text-ink-500">
        <Link to={ROUTES.home} className="hover:text-ink-900">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={ROUTES.catalog} className="hover:text-ink-900">Catálogo</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={ROUTES.catalogByCategory(category.slug)} className="hover:text-ink-900">{category.name}</Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-800">{product.name}</span>
      </div>

      <div className="container-app grid grid-cols-1 gap-10 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <ProductGallery images={product.images} productName={product.name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="eyebrow">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} reviewCount={product.reviewCount} showValue />
            <span className="text-xs text-ink-400">SKU: {product.sku}</span>
          </div>

          {product.badges && product.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.badges.map((b) => <ProductBadgePill key={b} badge={b} />)}
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink-900">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-base text-ink-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
            {discount > 0 && <span className="text-sm font-semibold text-success">-{discount}%</span>}
          </div>
          <p className="mt-1 text-sm text-ink-500">{installmentText(product.price)}</p>

          <p className="mt-2 text-xs">
            {product.stock > 10 ? (
              <span className="text-success">Em estoque</span>
            ) : product.stock > 0 ? (
              <span className="font-semibold text-gold-600">Restam apenas {product.stock} unidades</span>
            ) : (
              <span className="text-danger">Esgotado</span>
            )}
          </p>

          {/* Cor */}
          {product.colors.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                Cor: <span className="font-normal text-ink-500">{selectedColor}</span>
              </p>
              <div className="mt-2.5 flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={`Selecionar cor ${c.name}`}
                    aria-pressed={selectedColor === c.name}
                    className={classNames(
                      'h-9 w-9 rounded-full border-2 transition-all',
                      selectedColor === c.name ? 'border-gold-500 scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tamanho */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Tamanho</p>
                <button className="link-underline text-2xs font-semibold text-ink-500">Guia de tamanhos</button>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (s.inStock) {
                        setSelectedSize(s.label);
                        setSizeError(false);
                      }
                    }}
                    disabled={!s.inStock}
                    aria-pressed={selectedSize === s.label}
                    className={classNames(
                      'min-w-[3rem] rounded-sm border px-3.5 py-2.5 text-sm font-medium transition-colors',
                      selectedSize === s.label
                        ? 'border-ink-900 bg-ink-900 text-cream-50'
                        : s.inStock
                        ? 'border-ink-300 text-ink-700 hover:border-ink-900'
                        : 'border-ink-100 text-ink-300 line-through'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {sizeError && <p className="mt-2 text-xs text-danger">Selecione um tamanho para continuar.</p>}
            </div>
          )}

          {/* Quantidade */}
          <div className="mt-6 flex items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">Quantidade</p>
            <div className="flex items-center rounded-sm border border-ink-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-ink-600 hover:text-ink-900"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="p-2.5 text-ink-600 hover:text-ink-900"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" fullWidth onClick={() => handleAddToCart(false)} disabled={product.stock === 0}>
              Adicionar ao carrinho
            </Button>
            <Button variant="gold" fullWidth onClick={() => handleAddToCart(true)} disabled={product.stock === 0}>
              Comprar agora
            </Button>
            <button
              onClick={() => toggleFavorite(product)}
              aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-pressed={favorite}
              className="flex items-center justify-center rounded-sm border border-ink-300 p-3.5 text-ink-700 hover:border-danger hover:text-danger"
            >
              <Heart className={classNames('h-5 w-5', favorite && 'fill-danger text-danger')} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-ink-200 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-xs text-ink-600">
              <Truck className="h-4 w-4 text-gold-600" /> Chegada estimada {estimateDeliveryDate(7)}
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-600">
              <RotateCcw className="h-4 w-4 text-gold-600" /> Troca grátis em 30 dias
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-600">
              <ShieldCheck className="h-4 w-4 text-gold-600" /> Compra 100% segura
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs: descrição / avaliações */}
      <div className="container-app mt-14">
        <div className="flex gap-8 border-b border-ink-200">
          <button
            onClick={() => setActiveTab('descricao')}
            className={classNames(
              'border-b-2 pb-3 text-sm font-semibold uppercase tracking-wide transition-colors',
              activeTab === 'descricao' ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400'
            )}
          >
            Descrição
          </button>
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={classNames(
              'border-b-2 pb-3 text-sm font-semibold uppercase tracking-wide transition-colors',
              activeTab === 'avaliacoes' ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400'
            )}
          >
            Avaliações ({product.reviewCount})
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'descricao' ? (
            <p className="max-w-2xl text-sm leading-relaxed text-ink-600">{product.description}</p>
          ) : (
            <div className="flex flex-col gap-6">
              {product.reviews?.map((review) => (
                <div key={review.id} className="flex gap-4 border-b border-ink-100 pb-6">
                  <img src={review.authorAvatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-900">{review.authorName}</p>
                      {review.verifiedPurchase && (
                        <span className="text-2xs text-success">Compra verificada</span>
                      )}
                    </div>
                    <Rating value={review.rating} className="mt-1" />
                    <p className="mt-2 text-sm text-ink-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RelatedProducts title="Quem comprou também comprou" products={alsoBought} onQuickView={setQuickViewProduct} />
      <RelatedProducts title="Produtos semelhantes" products={similarProducts} onQuickView={setQuickViewProduct} />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
