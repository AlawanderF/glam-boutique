import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandsCarousel } from '@/components/home/BrandsCarousel';
import { Testimonials } from '@/components/home/Testimonials';
import { Benefits } from '@/components/home/Benefits';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandsCarousel />
      <Testimonials />
      <Benefits />
      <NewsletterSection />
    </>
  );
}
