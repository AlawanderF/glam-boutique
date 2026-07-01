import { motion } from 'framer-motion';
import { categories } from '@/constants/categories';
import { CategoryCard } from '@/components/category/CategoryCard';

export function CategoryGrid() {
  return (
    <section className="container-app py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex flex-col items-center text-center"
      >
        <span className="eyebrow">Explore</span>
        <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">Compre por categoria</h2>
        <p className="mt-3 max-w-md text-sm text-ink-500">
          Curadoria pensada para cada estilo, ocasião e momento da sua rotina.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </section>
  );
}
