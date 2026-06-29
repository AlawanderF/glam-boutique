import { Star } from 'lucide-react';
import { classNames } from '@/utils/format';

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, reviewCount, size = 'sm', showValue = false, className }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';

  return (
    <div className={classNames('flex items-center gap-1.5', className)} role="img" aria-label={`Avaliação ${value} de 5 estrelas`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(value);
          return (
            <Star
              key={i}
              className={classNames(starSize, filled ? 'fill-gold-500 text-gold-500' : 'fill-transparent text-ink-300')}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showValue && <span className="text-xs font-semibold text-ink-700">{value.toFixed(1)}</span>}
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-ink-500">({reviewCount})</span>
      )}
    </div>
  );
}
