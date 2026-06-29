import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';

const messages = [
  { icon: Truck, text: 'Frete grátis para compras acima de R$ 299' },
  { icon: RotateCcw, text: 'Troca fácil e gratuita em até 30 dias' },
  { icon: ShieldCheck, text: 'Pagamento 100% seguro' },
  { icon: Sparkles, text: 'Ganhe 10% OFF na primeira compra' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const Current = messages[index];

  return (
    <div className="relative h-9 overflow-hidden bg-ink-900 text-cream-100">
      <div className="container-app flex h-full items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 text-2xs font-medium uppercase tracking-wider sm:text-xs"
          >
            <Current.icon className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            <span>{Current.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
