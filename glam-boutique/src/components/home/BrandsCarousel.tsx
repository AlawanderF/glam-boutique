import { brands } from '@/constants/brands';

export function BrandsCarousel() {
  // Duplicamos a lista para criar o efeito de loop infinito do marquee
  const loopBrands = [...brands, ...brands];

  return (
    <section className="border-y border-ink-200 bg-cream-50 py-10">
      <div className="container-app mb-6 flex items-center justify-center">
        <span className="eyebrow">Marcas parceiras selecionadas</span>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream-50 to-transparent" />
        <div className="flex w-max animate-marquee gap-16">
          {loopBrands.map((brand, i) => (
            <span
              key={`${brand.id}-${i}`}
              className="select-none whitespace-nowrap font-display text-xl tracking-wide text-ink-300 transition-colors hover:text-ink-700"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
