import type { Product, ProductColor, ProductSize } from '@/types';

const colorPalette: Record<string, ProductColor> = {
  preto: { id: 'preto', name: 'Preto', hex: '#15130f' },
  branco: { id: 'branco', name: 'Off-White', hex: '#f5f1e8' },
  bege: { id: 'bege', name: 'Bege', hex: '#cda255' },
  vinho: { id: 'vinho', name: 'Vinho', hex: '#5c2128' },
  azulMarinho: { id: 'azul-marinho', name: 'Azul-marinho', hex: '#1f2a44' },
  verdeOliva: { id: 'verde-oliva', name: 'Verde-oliva', hex: '#5b6b3f' },
  caramelo: { id: 'caramelo', name: 'Caramelo', hex: '#a9652e' },
  cinza: { id: 'cinza', name: 'Cinza-chumbo', hex: '#4a4944' },
};

const sizesRoupa = (skip: string[] = []): ProductSize[] =>
  ['PP', 'P', 'M', 'G', 'GG']
    .map((label) => ({ id: label.toLowerCase(), label, inStock: !skip.includes(label) }));

const sizesCalcado = (skip: string[] = []): ProductSize[] =>
  ['34', '35', '36', '37', '38', '39', '40'].map((label) => ({
    id: label,
    label,
    inStock: !skip.includes(label),
  }));

interface Seed {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  gender: Product['gender'];
  price: number;
  compareAtPrice?: number;
  images: string[];
  hoverImage?: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  stock: number;
  badges?: Product['badges'];
  daysAgo: number;
  salesCount: number;
  description: string;
}

const seeds: Seed[] = [
  {
    slug: 'vestido-midi-alfaiataria-noir',
    sku: 'GB-VST-0021',
    name: 'Vestido Midi Alfaiataria',
    brand: 'NOIR ATELIER',
    categoryId: 'cat-social',
    gender: 'feminino',
    price: 489.9,
    compareAtPrice: 649.9,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.preto, colorPalette.vinho],
    sizes: sizesRoupa(['PP']),
    rating: 4.8,
    reviewCount: 132,
    stock: 24,
    badges: ['mais-vendido', 'promocao'],
    daysAgo: 40,
    salesCount: 412,
    description:
      'Vestido midi em alfaiataria premium com corte que valoriza a silhueta. Tecido com caimento fluido, fechamento em zíper invisível e forro interno em viscose. Peça versátil para eventos sociais e ambientes corporativos sofisticados.',
  },
  {
    slug: 'blazer-oversized-linho-areia',
    sku: 'GB-BLZ-0104',
    name: 'Blazer Oversized em Linho',
    brand: 'MAISON LUME',
    categoryId: 'cat-feminino',
    gender: 'feminino',
    price: 379.0,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.bege, colorPalette.branco],
    sizes: sizesRoupa(),
    rating: 4.6,
    reviewCount: 58,
    stock: 31,
    badges: ['novo'],
    daysAgo: 6,
    salesCount: 89,
    description:
      'Blazer de modelagem oversized confeccionado em linho premium, ideal para compor looks despojados ou formais. Forro respirável e botões em madrepérola sintética.',
  },
  {
    slug: 'camisa-social-slim-listrada',
    sku: 'GB-CAM-0233',
    name: 'Camisa Social Slim Listrada',
    brand: 'OBLIQUE',
    categoryId: 'cat-masculino',
    gender: 'masculino',
    price: 219.9,
    compareAtPrice: 259.9,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.azulMarinho, colorPalette.branco],
    sizes: sizesRoupa(),
    rating: 4.7,
    reviewCount: 204,
    stock: 58,
    badges: ['mais-vendido'],
    daysAgo: 70,
    salesCount: 530,
    description:
      'Camisa social de corte slim em tricoline de algodão egípcio, com listras finas atemporais. Acabamento premium em colarinho e punho, perfeita para o ambiente corporativo.',
  },
  {
    slug: 'calca-alfaiataria-pantalona-cinza',
    sku: 'GB-CAL-0089',
    name: 'Calça Alfaiataria Pantalona',
    brand: 'VERA STUDIO',
    categoryId: 'cat-feminino',
    gender: 'feminino',
    price: 299.9,
    images: [
      'https://images.unsplash.com/photo-1632149877166-f75d49000351?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.cinza, colorPalette.preto],
    sizes: sizesRoupa(),
    rating: 4.5,
    reviewCount: 41,
    stock: 19,
    daysAgo: 15,
    salesCount: 67,
    description:
      'Calça pantalona de cintura alta em tecido alfaiataria com leve elastano. Modelagem reta e fluida, ideal para compor produções elegantes do dia a dia ao trabalho.',
  },
  {
    slug: 'jaqueta-couro-ecologico-classica',
    sku: 'GB-JQT-0301',
    name: 'Jaqueta Couro Ecológico Clássica',
    brand: 'TERRA NOVA',
    categoryId: 'cat-casual',
    gender: 'unissex',
    price: 459.0,
    compareAtPrice: 599.0,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.preto, colorPalette.caramelo],
    sizes: sizesRoupa(['GG']),
    rating: 4.9,
    reviewCount: 167,
    stock: 12,
    badges: ['exclusivo', 'ultimas-unidades'],
    daysAgo: 100,
    salesCount: 298,
    description:
      'Jaqueta em couro ecológico de alta durabilidade com forro acolchoado removível. Design atemporal com ziper metálico e bolsos frontais funcionais.',
  },
  {
    slug: 'tenis-runner-performance-branco',
    sku: 'GB-TEN-0450',
    name: 'Tênis Runner Performance',
    brand: 'BLANC & CO',
    categoryId: 'cat-esportivo',
    gender: 'unissex',
    price: 349.9,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.branco, colorPalette.cinza],
    sizes: sizesCalcado(),
    rating: 4.7,
    reviewCount: 312,
    stock: 64,
    badges: ['mais-vendido'],
    daysAgo: 30,
    salesCount: 601,
    description:
      'Tênis com tecnologia de amortecimento responsivo e cabedal em mesh respirável. Desenvolvido para alta performance sem abrir mão do design urbano contemporâneo.',
  },
  {
    slug: 'vestido-longo-fluido-estampado',
    sku: 'GB-VST-0145',
    name: 'Vestido Longo Fluido Estampado',
    brand: 'ÁUREA',
    categoryId: 'cat-feminino',
    gender: 'feminino',
    price: 329.9,
    compareAtPrice: 419.9,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.verdeOliva, colorPalette.caramelo],
    sizes: sizesRoupa(),
    rating: 4.6,
    reviewCount: 95,
    stock: 27,
    badges: ['promocao'],
    daysAgo: 50,
    salesCount: 220,
    description:
      'Vestido longo em tecido fluido com estampa exclusiva da coleção. Decote em V e fenda lateral discreta, perfeito para dias de verão com elegância natural.',
  },
  {
    slug: 'moletom-essential-oversized',
    sku: 'GB-MOL-0512',
    name: 'Moletom Essential Oversized',
    brand: 'CASA VENTO',
    categoryId: 'cat-casual',
    gender: 'unissex',
    price: 189.9,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.cinza, colorPalette.preto, colorPalette.branco],
    sizes: sizesRoupa(),
    rating: 4.8,
    reviewCount: 245,
    stock: 80,
    badges: ['mais-vendido', 'novo'],
    daysAgo: 4,
    salesCount: 480,
    description:
      'Moletom em algodão peruano com modelagem oversized e felpa interna macia. Essencial atemporal para um guarda-roupa versátil em qualquer estação.',
  },
  {
    slug: 'bolsa-tote-couro-legitimo',
    sku: 'GB-BOL-0610',
    name: 'Bolsa Tote em Couro Legítimo',
    brand: 'NOIR ATELIER',
    categoryId: 'cat-acessorios',
    gender: 'feminino',
    price: 549.0,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.preto, colorPalette.caramelo],
    sizes: [],
    rating: 4.9,
    reviewCount: 78,
    stock: 15,
    badges: ['exclusivo'],
    daysAgo: 20,
    salesCount: 140,
    description:
      'Bolsa tote artesanal em couro legítimo curtido naturalmente, com alças reforçadas e bolso interno com zíper. Estrutura ampla que acompanha a rotina com sofisticação.',
  },
  {
    slug: 'oculos-sol-acetato-redondo',
    sku: 'GB-OCL-0077',
    name: 'Óculos de Sol Acetato Redondo',
    brand: 'ÁUREA',
    categoryId: 'cat-acessorios',
    gender: 'unissex',
    price: 159.9,
    compareAtPrice: 219.9,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.preto, colorPalette.bege],
    sizes: [],
    rating: 4.4,
    reviewCount: 53,
    stock: 40,
    badges: ['promocao'],
    daysAgo: 12,
    salesCount: 132,
    description:
      'Óculos de sol em acetato italiano com lentes polarizadas e proteção UV400. Design redondo atemporal que complementa diferentes formatos de rosto.',
  },
  {
    slug: 'sandalia-couro-tira-fina',
    sku: 'GB-SAN-0820',
    name: 'Sandália Couro Tira Fina',
    brand: 'MAISON LUME',
    categoryId: 'cat-calcados',
    gender: 'feminino',
    price: 259.9,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554062614-6da4fa67725f?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1554062614-6da4fa67725f?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.caramelo, colorPalette.preto],
    sizes: sizesCalcado(['34']),
    rating: 4.6,
    reviewCount: 89,
    stock: 22,
    daysAgo: 22,
    salesCount: 176,
    description:
      'Sandália em couro legítimo com tiras finas e fivela ajustável em metal dourado. Solado em couro com forração macia para conforto durante todo o dia.',
  },
  {
    slug: 'conjunto-infantil-algodao-listrado',
    sku: 'GB-INF-0930',
    name: 'Conjunto Infantil Algodão Listrado',
    brand: 'CASA VENTO',
    categoryId: 'cat-infantil',
    gender: 'infantil',
    price: 129.9,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503944168849-0d9384361ba6?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1503944168849-0d9384361ba6?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.azulMarinho, colorPalette.branco],
    sizes: [
      { id: '2a', label: '2 anos', inStock: true },
      { id: '4a', label: '4 anos', inStock: true },
      { id: '6a', label: '6 anos', inStock: true },
      { id: '8a', label: '8 anos', inStock: false },
    ],
    rating: 4.7,
    reviewCount: 64,
    stock: 35,
    badges: ['novo'],
    daysAgo: 8,
    salesCount: 98,
    description:
      'Conjunto infantil em algodão 100% com toque suave e costuras reforçadas. Estampa listrada atemporal, ideal para o dia a dia com muito conforto.',
  },
  {
    slug: 'short-tecido-leve-feminino',
    sku: 'GB-SHT-0411',
    name: 'Short Tecido Leve',
    brand: 'VERA STUDIO',
    categoryId: 'cat-feminino',
    gender: 'feminino',
    price: 149.9,
    compareAtPrice: 189.9,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.bege, colorPalette.preto],
    sizes: sizesRoupa(),
    rating: 4.3,
    reviewCount: 37,
    stock: 44,
    badges: ['promocao'],
    daysAgo: 18,
    salesCount: 88,
    description:
      'Short confeccionado em tecido leve e fresco, com cintura média e amarração lateral ajustável. Peça-chave para o verão com praticidade e estilo.',
  },
  {
    slug: 'camiseta-basica-algodao-pima',
    sku: 'GB-CMT-0019',
    name: 'Camiseta Básica Algodão Pima',
    brand: 'BLANC & CO',
    categoryId: 'cat-casual',
    gender: 'unissex',
    price: 99.9,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.branco, colorPalette.preto, colorPalette.cinza],
    sizes: sizesRoupa(),
    rating: 4.8,
    reviewCount: 412,
    stock: 120,
    badges: ['mais-vendido'],
    daysAgo: 200,
    salesCount: 980,
    description:
      'Camiseta básica em algodão pima de fibra longa, com toque macio e durabilidade superior. Modelagem unissex que combina com qualquer produção.',
  },
  {
    slug: 'saia-midi-plissada-cetim',
    sku: 'GB-SAI-0205',
    name: 'Saia Midi Plissada em Cetim',
    brand: 'ÁUREA',
    categoryId: 'cat-social',
    gender: 'feminino',
    price: 269.9,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=1000&auto=format&fit=crop',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=1000&auto=format&fit=crop',
    colors: [colorPalette.vinho, colorPalette.preto],
    sizes: sizesRoupa(),
    rating: 4.7,
    reviewCount: 61,
    stock: 18,
    badges: ['novo'],
    daysAgo: 3,
    salesCount: 45,
    description:
      'Saia midi plissada em cetim com caimento fluido e brilho sutil. Cintura com elástico interno para ajuste confortável durante todo o dia.',
  },
  {
    slug: 'tenis-casual-couro-classico',
    sku: 'GB-TEN-0660',
    name: 'Tênis Casual Couro Clássico',
    brand: 'OBLIQUE',
    categoryId: 'cat-calcados',
    gender: 'masculino',
    price: 399.9,
    compareAtPrice: 459.9,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop',
    ],
    colors: [colorPalette.branco, colorPalette.preto],
    sizes: sizesCalcado(),
    rating: 4.5,
    reviewCount: 145,
    stock: 38,
    badges: ['promocao'],
    daysAgo: 33,
    salesCount: 267,
    description:
      'Tênis casual em couro legítimo com solado em borracha de alta aderência. Design minimalista que transita facilmente entre looks formais e informais.',
  },
];

const reviewBank = [
  'Produto chegou rápido e a qualidade do tecido é excelente, superou minhas expectativas.',
  'Caimento perfeito, exatamente como nas fotos. Recomendo demais.',
  'Atendimento da loja foi muito atencioso quando tive dúvidas sobre o tamanho.',
  'Já é a segunda vez que compro essa peça, qualidade impecável.',
  'O acabamento é surpreendente para o preço, virei cliente fiel da marca.',
];

function buildReviews(count: number, baseRating: number) {
  const n = Math.min(count, 5);
  return Array.from({ length: n }).map((_, i) => ({
    id: `rev-${i}`,
    authorName: ['Júlia M.', 'Pedro H.', 'Carla S.', 'André L.', 'Fernanda O.'][i],
    authorAvatarUrl: `https://i.pravatar.cc/100?img=${20 + i}`,
    rating: Math.max(3, Math.min(5, Math.round(baseRating + (i % 2 === 0 ? 0 : -1)))),
    comment: reviewBank[i],
    date: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 12).toISOString(),
    verifiedPurchase: true,
  }));
}

export const products: Product[] = seeds.map((s) => ({
  id: s.sku,
  slug: s.slug,
  sku: s.sku,
  name: s.name,
  brand: s.brand,
  description: s.description,
  shortDescription: s.description.slice(0, 90) + '…',
  categoryId: s.categoryId,
  gender: s.gender,
  price: s.price,
  compareAtPrice: s.compareAtPrice,
  currency: 'BRL',
  images: s.images,
  hoverImage: s.hoverImage,
  colors: s.colors,
  sizes: s.sizes,
  rating: s.rating,
  reviewCount: s.reviewCount,
  reviews: buildReviews(5, s.rating),
  stock: s.stock,
  badges: s.badges,
  createdAt: new Date(Date.now() - s.daysAgo * 1000 * 60 * 60 * 24).toISOString(),
  salesCount: s.salesCount,
}));

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId);
export const getBestSellers = () => [...products].sort((a, b) => b.salesCount - a.salesCount);
export const getNewArrivals = () =>
  [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const getOnSale = () => products.filter((p) => !!p.compareAtPrice);
export const getTopRated = () => [...products].sort((a, b) => b.rating - a.rating);

// Mapa de contagem real de produtos por categoryId — atualiza automaticamente
// quando novos produtos são adicionados aos dados mock (ou vindos da API).
export const productCountByCategoryId: Record<string, number> = products.reduce<Record<string, number>>(
  (acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
    return acc;
  },
  {}
);
