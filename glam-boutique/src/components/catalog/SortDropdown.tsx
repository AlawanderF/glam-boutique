import type { SortOption } from '@/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'mais-vendidos', label: 'Mais vendidos' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'melhor-avaliacao', label: 'Melhor avaliação' },
  { value: 'mais-recentes', label: 'Mais recentes' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-600">
      <span className="hidden sm:inline">Ordenar por:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="cursor-pointer border border-ink-300 bg-cream-50 px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-gold-500"
        aria-label="Ordenar produtos"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
