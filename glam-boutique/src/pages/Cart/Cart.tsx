import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Tag, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { getBestSellers } from '@/constants/products';
import { formatCurrency, installmentText } from '@/utils/format';
import { ROUTES, FREE_SHIPPING_THRESHOLD } from '@/constants';
import { useToastStore } from '@/store/toastStore';

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Entrega padrão', days: '5 a 8 dias úteis', price: 19.9 },
  { id: 'express', label: 'Entrega expressa', days: '2 a 3 dias úteis', price: 39.9 },
];

export default function Cart() {
  const { items, removeItem, updateQuantity, applyCoupon, removeCoupon, couponCode, subtotal, discountAmount, total } =
    useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [shippingOption, setShippingOption] = useState<string | null>(null);
  const showToast = useToastStore((s) => s.show);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal());
  const progress = Math.min(100, (subtotal() / FREE_SHIPPING_THRESHOLD) * 100);
  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingOption);
  const shippingCost = subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : selectedShipping?.price ?? 0;
  const orderTotal = total() + shippingCost;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponMessage({ type: 'success', text: 'Cupom aplicado com sucesso!' });
      showToast({ type: 'success', message: 'Cupom aplicado', description: couponInput.toUpperCase() });
    } else {
      setCouponMessage({ type: 'error', text: 'Cupom inválido ou expirado.' });
    }
  };

  const handleCalculateShipping = () => {
    if (zipCode.replace(/\D/g, '').length >= 8) {
      setShippingOption('standard');
    }
  };

  const recommended = getBestSellers()
    .filter((p) => !items.some((i) => i.productId === p.id))
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="h-12 w-12 text-ink-300" />
        <h1 className="mt-4 font-display text-2xl text-ink-900">Sua sacola está vazia</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-500">
          Explore nossas categorias e descubra peças selecionadas especialmente para você.
        </p>
        <Link to={ROUTES.catalog} className="mt-6">
          <Button variant="primary">Continuar comprando</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl text-ink-900">Carrinho de compras</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Itens */}
        <div>
          <div className="border-b border-ink-200 bg-ink-50/50 px-5 py-3">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-ink-600">
                Faltam <strong className="text-ink-900">{formatCurrency(remainingForFreeShipping)}</strong> para frete grátis
              </p>
            ) : (
              <p className="text-xs font-semibold text-success">Você ganhou frete grátis! 🎉</p>
            )}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-200">
              <motion.div
                className="h-full rounded-full bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <ul className="divide-y divide-ink-100">
            {items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-5 py-6"
              >
                <img src={item.image} alt={item.name} className="h-32 w-24 flex-shrink-0 rounded-sm object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xs uppercase tracking-wider text-ink-400">{item.brand}</p>
                      <p className="font-display text-base text-ink-900">{item.name}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {[item.colorName, item.sizeLabel].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remover ${item.name} do carrinho`}
                      className="text-ink-400 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-sm border border-ink-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-ink-600 hover:text-ink-900"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-ink-600 hover:text-ink-900"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      {item.compareAtPrice && (
                        <p className="text-xs text-ink-400 line-through">
                          {formatCurrency(item.compareAtPrice * item.quantity)}
                        </p>
                      )}
                      <p className="font-display text-base text-ink-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Calculadora de frete */}
          <div className="mt-8 border border-ink-200 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Truck className="h-4 w-4 text-gold-600" /> Calcular frete e prazo de entrega
            </p>
            <div className="mt-3 flex gap-3">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Digite seu CEP"
                maxLength={9}
                className="flex-1 border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500"
                aria-label="CEP para cálculo de frete"
              />
              <Button variant="secondary" size="sm" onClick={handleCalculateShipping}>
                Calcular
              </Button>
            </div>

            {shippingOption && (
              <div className="mt-4 flex flex-col gap-2">
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center justify-between rounded-sm border border-ink-200 px-4 py-3 text-sm hover:border-ink-400"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption === option.id}
                        onChange={() => setShippingOption(option.id)}
                        className="text-ink-900 focus:ring-gold-500"
                      />
                      <span>
                        <span className="font-medium text-ink-900">{option.label}</span>
                        <span className="ml-2 text-xs text-ink-500">{option.days}</span>
                      </span>
                    </span>
                    <span className="font-medium text-ink-900">
                      {subtotal() >= FREE_SHIPPING_THRESHOLD ? 'Grátis' : formatCurrency(option.price)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="h-fit border border-ink-200 p-6">
          <h2 className="font-display text-lg text-ink-900">Resumo do pedido</h2>

          <div className="mt-5 flex flex-col gap-2">
            <label htmlFor="coupon" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-700">
              <Tag className="h-3.5 w-3.5" /> Cupom de desconto
            </label>
            {couponCode ? (
              <div className="flex items-center justify-between rounded-sm bg-success/10 px-4 py-2.5 text-sm text-success">
                <span>Cupom <strong>{couponCode}</strong> aplicado</span>
                <button onClick={removeCoupon} className="text-xs underline">Remover</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="coupon"
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Ex: GLAM10"
                  className="flex-1 border border-ink-300 px-4 py-2.5 text-sm uppercase focus:outline-none focus:border-gold-500"
                />
                <Button variant="secondary" size="sm" onClick={handleApplyCoupon}>
                  Aplicar
                </Button>
              </div>
            )}
            {couponMessage && (
              <p className={`text-xs ${couponMessage.type === 'success' ? 'text-success' : 'text-danger'}`} role="alert">
                {couponMessage.text}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-200 pt-5 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal())}</span>
            </div>
            {discountAmount() > 0 && (
              <div className="flex justify-between text-success">
                <span>Desconto</span>
                <span>-{formatCurrency(discountAmount())}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-600">
              <span>Frete</span>
              <span>{shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-ink-200 pt-4">
            <span className="font-display text-lg text-ink-900">Total</span>
            <span className="font-display text-2xl text-ink-900">{formatCurrency(orderTotal)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-ink-500">{installmentText(orderTotal)}</p>

          <Link to={ROUTES.checkout} className="mt-6 block">
            <Button variant="primary" fullWidth>
              Finalizar compra
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            to={ROUTES.catalog}
            className="mt-3 block text-center text-xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900"
          >
            Continuar comprando
          </Link>
        </div>
      </div>

      <RelatedProducts title="Você também pode gostar" products={recommended} />
    </div>
  );
}
