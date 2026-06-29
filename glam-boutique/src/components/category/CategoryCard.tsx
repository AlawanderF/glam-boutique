import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '@/types';
import { ROUTES } from '@/constants';

interface CategoryCardProps {
  category: Category;
  index?: number;
  size?: 'normal' | 'large';
}

export function CategoryCard({ category, index = 0, size = 'normal' }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={ROUTES.catalogByCategory(category.slug)}
        className={`group relative block overflow-hidden bg-ink-900 ${
          size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/5]'
        }`}
      >
        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-100 object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent transition-opacity duration-500 group-hover:from-ink-950/90" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
          <span className="eyebrow text-gold-300">{category.productCount} peças</span>
          <h3 className="mt-1 flex items-center gap-2 font-display text-xl text-cream-50 sm:text-2xl">
            {category.name}
            <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
          </h3>
          <span className="mt-2 h-px w-0 bg-gold-400 transition-all duration-500 ease-luxe group-hover:w-12" />
        </div>
      </Link>
    </motion.div>
  );
}
