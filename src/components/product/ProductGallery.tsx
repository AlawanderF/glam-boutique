import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '@/utils/format';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Thumbnails */}
      <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Ver imagem ${i + 1} de ${productName}`}
            aria-current={activeIndex === i}
            className={classNames(
              'flex-shrink-0 overflow-hidden border-2 transition-colors',
              activeIndex === i ? 'border-gold-500' : 'border-transparent hover:border-ink-300'
            )}
          >
            <img src={img} alt="" className="h-20 w-16 object-cover sm:h-24 sm:w-20" />
          </button>
        ))}
      </div>

      {/* Main image with zoom */}
      <div
        ref={containerRef}
        className="relative order-1 flex-1 overflow-hidden bg-ink-100 sm:order-2"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="aspect-[3/4] w-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${productName} — imagem ${activeIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>

        {isZooming && (
          <div
            className="pointer-events-none absolute inset-0 hidden sm:block"
            style={{
              backgroundImage: `url(${images[activeIndex]})`,
              backgroundSize: '200%',
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            aria-hidden="true"
          />
        )}

        <span className="absolute bottom-3 right-3 rounded-full bg-cream-50/90 px-3 py-1 text-2xs font-medium text-ink-600 sm:hidden">
          {activeIndex + 1}/{images.length}
        </span>
      </div>
    </div>
  );
}
