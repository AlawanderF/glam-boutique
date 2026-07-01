import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES, BRAND } from '@/constants';

const heroImage =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_LUXE } },
};

export function Hero() {
  return (
    <section className="relative flex h-[88vh] min-h-[560px] w-full items-center overflow-hidden bg-ink-950 sm:h-[92vh]">
      <motion.img
        src={heroImage}
        alt="Modelo vestindo peça em alfaiataria da nova coleção Glam Boutique"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.12, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/40 to-ink-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="container-app relative z-10 flex flex-col items-start"
      >
        <motion.span variants={item} className="eyebrow text-gold-300">
          Nova coleção · {BRAND.tagline}
        </motion.span>
        <motion.h1
          variants={item}
          className="mt-4 max-w-xl font-display text-4xl leading-[1.1] text-cream-50 sm:text-5xl lg:text-6xl"
        >
          {BRAND.slogan}
        </motion.h1>
        <motion.p variants={item} className="mt-5 max-w-md text-sm leading-relaxed text-cream-100/85 sm:text-base">
          Peças cuidadosamente selecionadas para mulheres e homens que valorizam exclusividade,
          qualidade e atemporalidade em cada detalhe.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
          <Link to={ROUTES.catalog} className="btn-gold">
            Comprar agora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to={ROUTES.catalogByCategory('promocoes')} className="btn-ghost-light">
            Nova coleção
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-cream-50/70 sm:left-10 sm:translate-x-0"
      >
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <span className="text-2xs uppercase tracking-widest2">Role para explorar</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="h-8 w-px bg-cream-50/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
