import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface SEOMetaProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  brand?: string;
  sku?: string;
  keywords?: string[];
  noIndex?: boolean;
}

const SITE_URL = 'https://glam-boutique.com';
const DEFAULT_TITLE = 'Glam Boutique — Roupas, Calçados e Acessórios';
const DEFAULT_DESCRIPTION = 'Descubra a coleção Glam Boutique: roupas, calçados e acessórios de alta qualidade para um estilo único.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const SITE_NAME = 'Glam Boutique';

function setMetaTag(name: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    if (isProperty) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;

  let link = document.querySelector(selector) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

export function SEOMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  price,
  currency = 'BRL',
  availability = 'in_stock',
  brand = 'Glam Boutique',
  sku,
  keywords,
  noIndex = false,
}: SEOMetaProps) {
  const location = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  useEffect(() => {
    // Document title
    document.title = fullTitle;

    // Basic meta
    setMetaTag('description', description);
    setMetaTag('keywords', keywords?.join(', ') ?? 'roupas, calçados, acessórios, moda, glam boutique');
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('author', SITE_NAME);

    // Open Graph
    setMetaTag('og:site_name', SITE_NAME, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', fullImage, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:image:alt', title ?? DEFAULT_TITLE, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:locale', 'pt_BR', true);
    setMetaTag('og:locale:alternate', 'en_US', true);

    // Product-specific
    if (type === 'product') {
      setMetaTag('og:price:amount', String(price ?? ''), true);
      setMetaTag('og:price:currency', currency, true);
      setMetaTag('product:price:amount', String(price ?? ''), true);
      setMetaTag('product:price:currency', currency, true);
    }

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:site', '@glamboutique');
    setMetaTag('twitter:creator', '@glamboutique');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', fullImage);
    setMetaTag('twitter:image:alt', title ?? DEFAULT_TITLE);

    // Canonical
    setLinkTag('canonical', canonicalUrl);

    // Alternate hreflang
    const alternatePath = canonicalUrl.replace('/pt', '');
    setLinkLinkTag('alternate', `${alternatePath}`, 'x-default');
    setLinkLinkTag('alternate', `${alternatePath}`, 'pt-BR');
    setLinkLinkTag('alternate', `${alternatePath.replace('glam-boutique.com', 'glam-boutique.com/en')}`, 'en-US');

    // JSON-LD Structured Data
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: fullTitle,
      description,
      url: canonicalUrl,
      image: fullImage,
      ...(type === 'product' && {
        brand: { '@type': 'Brand', name: brand },
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability === 'in_stock' ? 'InStock' : availability === 'out_of_stock' ? 'OutOfStock' : 'PreOrder'}`,
          seller: { '@type': 'Organization', name: SITE_NAME },
        },
        ...(sku && { sku }),
      }),
    };

    script.textContent = JSON.stringify(baseSchema);

  }, [fullTitle, description, fullImage, canonicalUrl, type, price, currency, availability, brand, sku, keywords, noIndex]);

  return null;
}

function setLinkLinkTag(rel: string, href: string, hreflang: string) {
  const selector = `link[rel="${rel}"][hreflang="${hreflang}"]`;
  let link = document.querySelector(selector) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}
