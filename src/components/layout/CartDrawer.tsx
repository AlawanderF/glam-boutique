import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format';
import { ROUTES, FREE_SHIPPING_THRESHOLD } from '@/constants';

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal());
  const progress = Math.min(100, (subtotal() / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink-950/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[85] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-elevated"
          >
            <div className="flex items-center justify-between border-b border-ink-200 p-5">
              <h2 className="font-display text-lg text-ink-900">Sua sacola ({items.length})</h2>
              <button onClick={closeCart} aria-label="Fechar carrinho" className="text-ink-500 hover:text-ink-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length > 0 && (
              <div className="border-b border-ink-200 bg-ink-50/60 px-5 py-3">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-xs text-ink-600">
                    Faltam <strong className="text-ink-900">{formatCurrency(remainingForFreeShipping)}</strong> para
                    frete grátis
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-success">Você ganhou frete grátis! 🎉</p>
                )}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-200">
                  <motion.div
                    className="h-full rounded-full bg-gold-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-10 w-10 text-ink-300" />
                  <p className="text-sm text-ink-500">Sua sacola está vazia.</p>
                  <Button variant="secondary" size="sm" onClick={closeCart}>
                    Continuar comprando
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-20 flex-shrink-0 rounded-sm object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <p className="text-2xs uppercase tracking-wider text-ink-400">{item.brand}</p>
                        <p className="text-sm font-medium text-ink-900">{item.name}</p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {[item.colorName, item.sizeLabel].filter(Boolean).join(' · ')}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-sm border border-ink-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-ink-600 hover:text-ink-900"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 text-ink-600 hover:text-ink-900"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-display text-sm text-ink-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="link-underline mt-2 self-start text-2xs font-semibold uppercase tracking-wider text-ink-400 hover:text-danger"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink-200 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-ink-600">Subtotal</span>
                  <span className="font-display text-lg text-ink-900">{formatCurrency(subtotal())}</span>
                </div>
                <Link to={ROUTES.cart} onClick={closeCart}>
                  <Button variant="primary" fullWidth>
                    Finalizar compra
                  </Button>
                </Link>
                <button
                  onClick={closeCart}
                  className="mt-3 w-full text-center text-xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
