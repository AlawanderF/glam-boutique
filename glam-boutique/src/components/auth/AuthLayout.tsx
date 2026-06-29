import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES, BRAND } from '@/constants';

const authImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <img src={authImage} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <span className="font-display text-3xl text-cream-50">{BRAND.name}</span>
          <p className="mt-2 max-w-sm text-sm text-cream-100/80">{BRAND.slogan}.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <Link to={ROUTES.home} className="font-display text-2xl text-ink-900 lg:hidden">
            {BRAND.name}
          </Link>
          <h1 className="mt-6 font-display text-3xl text-ink-900 lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
