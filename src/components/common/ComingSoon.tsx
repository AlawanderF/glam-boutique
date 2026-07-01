import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants';

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">Em desenvolvimento</span>
        <h1 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">{description}</p>
        <Link
          to={ROUTES.home}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-900 hover:text-gold-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a home
        </Link>
      </motion.div>
    </div>
  );
}
