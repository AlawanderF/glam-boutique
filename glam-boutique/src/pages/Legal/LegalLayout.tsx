import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants';

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <div className="container-app max-w-3xl py-12 sm:py-16">
      <Link
        to={ROUTES.home}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar para a loja
      </Link>

      <h1 className="mt-6 font-display text-3xl text-ink-900 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-xs text-ink-400">Última atualização: {updatedAt}</p>

      <div className="prose prose-sm mt-8 max-w-none text-ink-700 [&>h2]:font-display [&>h2]:text-lg [&>h2]:text-ink-900 [&>h2]:mt-8 [&>h2]:mb-3 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>li]:mb-1.5">
        {children}
      </div>
    </div>
  );
}
