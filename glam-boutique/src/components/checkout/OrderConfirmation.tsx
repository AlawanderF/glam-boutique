import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

interface OrderConfirmationProps {
  orderNumber: string;
  email: string;
}

export function OrderConfirmation({ orderNumber, email }: OrderConfirmationProps) {
  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
      >
        <CheckCircle2 className="h-10 w-10 text-success" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="mt-6 font-display text-3xl text-ink-900">Pedido confirmado!</h1>
        <p className="mt-3 max-w-md text-sm text-ink-500">
          Obrigada por comprar na Glam Boutique. Enviamos os detalhes do pedido para{' '}
          <strong className="text-ink-800">{email}</strong>.
        </p>

        <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 rounded-sm border border-ink-200 bg-ink-50/50 px-5 py-3">
          <Package className="h-4 w-4 text-gold-600" />
          <span className="text-sm font-semibold text-ink-900">Pedido #{orderNumber}</span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to={ROUTES.accountOrders}>
            <Button variant="primary">Acompanhar pedido</Button>
          </Link>
          <Link to={ROUTES.catalog}>
            <Button variant="secondary">Continuar comprando</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
