import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { classNames } from '@/utils/format';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  accent?: 'ink' | 'gold' | 'success' | 'danger';
}

const ACCENT_CLASSES: Record<NonNullable<KpiCardProps['accent']>, string> = {
  ink: 'bg-ink-100 text-ink-700',
  gold: 'bg-gold-100 text-gold-700',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
};

export function KpiCard({ label, value, icon: Icon, trend, accent = 'ink' }: KpiCardProps) {
  return (
    <div className="border border-ink-200 bg-cream-50 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
        <span className={classNames('flex h-9 w-9 items-center justify-center rounded-full', ACCENT_CLASSES[accent])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl text-ink-900">{value}</p>
      {trend && (
        <p
          className={classNames(
            'mt-1.5 flex items-center gap-1 text-xs font-medium',
            trend.isPositive ? 'text-success' : 'text-danger'
          )}
        >
          {trend.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {trend.value}% vs. período anterior
        </p>
      )}
    </div>
  );
}
