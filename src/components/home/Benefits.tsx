import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Clock3, Headphones } from 'lucide-react';

const benefits = [
  { icon: Truck, title: 'Frete grátis', text: 'Em compras acima de R$ 299 para todo o Brasil' },
  { icon: RotateCcw, title: 'Troca fácil', text: 'Até 30 dias para troca ou devolução sem complicação' },
  { icon: ShieldCheck, title: 'Pagamento seguro', text: 'Ambiente protegido e dados sempre criptografados' },
  { icon: Clock3, title: 'Entrega rápida', text: 'Despacho em até 24h após a confirmação do pedido' },
  { icon: Headphones, title: 'Atendimento especializado', text: 'Time pronto para te ajudar antes e depois da compra' },
];

export function Benefits() {
  return (
    <section className="border-y border-ink-200 bg-ink-50/50 py-14">
      <div className="container-app grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col items-center text-center sm:items-start sm:text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-700">
              <benefit.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink-900">{benefit.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{benefit.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
