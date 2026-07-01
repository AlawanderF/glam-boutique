import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '@/constants/testimonials';
import { Rating } from '@/components/ui/Rating';

export function Testimonials() {
  return (
    <section className="container-app py-16 sm:py-24">
      <div className="flex flex-col items-center text-center">
        <span className="eyebrow">Quem confia, recomenda</span>
        <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">O que nossas clientes dizem</h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 6).map((testimonial, i) => (
          <motion.figure
            key={testimonial.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: Math.min(i * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col rounded-sm border border-ink-200 bg-cream-50 p-7 shadow-soft"
          >
            <Quote className="h-6 w-6 text-gold-300" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
              “{testimonial.comment}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <img
                src={testimonial.authorAvatarUrl}
                alt=""
                className="h-11 w-11 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold text-ink-900">{testimonial.authorName}</p>
                <p className="text-xs text-ink-400">{testimonial.location}</p>
              </div>
              <Rating value={testimonial.rating} className="ml-auto" />
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
