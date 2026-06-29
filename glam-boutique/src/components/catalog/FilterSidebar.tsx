import { Star } from 'lucide-react';
import { categories } from '@/constants/categories';
import { products } from '@/constants/products';
import { formatCurrency, classNames } from '@/utils/format';
import type { CatalogFilterState } from '@/hooks/useFilteredProducts';
import type { Gender } from '@/types';

interface FilterSidebarProps {
  filters: CatalogFilterState;
  onChange: (filters: CatalogFilterState) => void;
  onClear: () => void;
}

const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
const allColors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes.map((s) => s.label))));
const genderOptions: { value: Gender; label: string }[] = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'unissex', label: 'Unissex' },
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink-900">Filtros</h2>
        <button onClick={onClear} className="text-2xs font-semibold uppercase tracking-wider text-ink-400 hover:text-danger">
          Limpar tudo
        </button>
      </div>

      {/* Categoria */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Categoria</legend>
        <div className="mt-3 flex flex-col gap-2.5">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={filters.categorySlugs.includes(c.slug)}
                onChange={() =>
                  onChange({ ...filters, categorySlugs: toggleValue(filters.categorySlugs, c.slug) })
                }
                className="h-4 w-4 rounded-none border-ink-300 text-ink-900 focus:ring-gold-500"
              />
              {c.name}
              <span className="text-ink-400">({c.productCount})</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Gênero */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Gênero</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {genderOptions.map((g) => (
            <button
              key={g.value}
              onClick={() => onChange({ ...filters, genders: toggleValue(filters.genders, g.value) })}
              aria-pressed={filters.genders.includes(g.value)}
              className={classNames(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                filters.genders.includes(g.value)
                  ? 'border-ink-900 bg-ink-900 text-cream-50'
                  : 'border-ink-300 text-ink-600 hover:border-ink-900'
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Marca */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Marca</legend>
        <div className="mt-3 flex flex-col gap-2.5 max-h-44 overflow-y-auto pr-2">
          {allBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onChange({ ...filters, brands: toggleValue(filters.brands, brand) })}
                className="h-4 w-4 rounded-none border-ink-300 text-ink-900 focus:ring-gold-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Cor */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Cor</legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {allColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onChange({ ...filters, colors: toggleValue(filters.colors, color.name) })}
              aria-pressed={filters.colors.includes(color.name)}
              aria-label={color.name}
              title={color.name}
              className={classNames(
                'h-8 w-8 rounded-full border-2 transition-all',
                filters.colors.includes(color.name) ? 'border-gold-500 scale-110' : 'border-ink-200'
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </fieldset>

      {/* Tamanho */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Tamanho</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })}
              aria-pressed={filters.sizes.includes(size)}
              className={classNames(
                'min-w-[2.5rem] rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors',
                filters.sizes.includes(size)
                  ? 'border-ink-900 bg-ink-900 text-cream-50'
                  : 'border-ink-300 text-ink-600 hover:border-ink-900'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Faixa de preço */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Faixa de preço</legend>
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
            }
            className="w-full accent-ink-900"
            aria-label="Preço máximo"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-500">
            <span>{formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </div>
        </div>
      </fieldset>

      {/* Avaliação */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink-700">Avaliação mínima</legend>
        <div className="mt-3 flex flex-col gap-2">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange({ ...filters, minRating: filters.minRating === rating ? null : rating })}
              aria-pressed={filters.minRating === rating}
              className={classNames(
                'flex items-center gap-1.5 text-sm transition-colors',
                filters.minRating === rating ? 'text-ink-900 font-semibold' : 'text-ink-500 hover:text-ink-800'
              )}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={classNames('h-3.5 w-3.5', i < rating ? 'fill-gold-500 text-gold-500' : 'text-ink-200')}
                />
              ))}
              <span>e acima</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Disponibilidade */}
      <fieldset>
        <label className="flex items-center gap-2.5 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={() => onChange({ ...filters, onlyInStock: !filters.onlyInStock })}
            className="h-4 w-4 rounded-none border-ink-300 text-ink-900 focus:ring-gold-500"
          />
          Apenas produtos disponíveis
        </label>
      </fieldset>
    </div>
  );
}
