import type { ProductBadge } from '@/types';
import { classNames } from '@/utils/format';

const BADGE_CONFIG: Record<ProductBadge, { label: string; className: string }> = {
  novo: { label: 'Novo', className: 'bg-info text-cream-50' },
  'mais-vendido': { label: 'Mais vendido', className: 'bg-ink-900 text-cream-50' },
  promocao: { label: 'Promoção', className: 'bg-danger text-cream-50' },
  exclusivo: { label: 'Exclusivo', className: 'bg-gold-500 text-ink-950' },
  'ultimas-unidades': { label: 'Últimas unidades', className: 'bg-ink-700 text-cream-50' },
};

export function ProductBadgePill({ badge }: { badge: ProductBadge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider shadow-sm',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function DiscountPill({ percent }: { percent: number }) {
  if (percent <= 0) return null;
  return (
    <span className="inline-flex items-center rounded-sm bg-danger px-2.5 py-1 text-2xs font-bold uppercase tracking-wider text-cream-50 shadow-sm">
      -{percent}%
    </span>
  );
}
