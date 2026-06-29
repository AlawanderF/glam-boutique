import { motion } from 'framer-motion';
import { NewsletterForm } from '@/components/home/NewsletterForm';

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)',
      }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-app relative z-10 flex flex-col items-center text-center"
      >
        <span className="eyebrow text-gold-400">Junte-se ao clube Glam</span>
        <h2 className="mt-3 max-w-lg font-display text-3xl text-cream-50 sm:text-4xl">
          Ganhe 10% OFF na primeira compra
        </h2>
        <p className="mt-3 max-w-md text-sm text-ink-300">
          Cadastre-se na nossa lista e receba acesso antecipado a lançamentos, promoções exclusivas e conteúdos de estilo.
        </p>
        <div className="mt-2 w-full max-w-lg">
          <NewsletterForm variant="dark" showNameField />
        </div>
      </motion.div>
    </section>
  );
}
