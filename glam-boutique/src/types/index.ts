export type Gender = 'feminino' | 'masculino' | 'infantil' | 'unissex';

export type ProductBadge = 'novo' | 'mais-vendido' | 'promocao' | 'exclusivo' | 'ultimas-unidades';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSize {
  id: string;
  label: string;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number; // 1 a 5
  comment: string;
  date: string; // ISO
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  gender: Gender;
  price: number;
  compareAtPrice?: number;
  currency: 'BRL';
  images: string[];
  hoverImage?: string;
  videoUrl?: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  stock: number;
  badges?: ProductBadge[];
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string; // ISO, usado para "lançamentos"
  salesCount: number; // usado para "mais vendidos"
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  comment: string;
  location?: string;
}

export interface CartItem {
  id: string; // id único da linha (produto+cor+tamanho)
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  colorName?: string;
  sizeLabel?: string;
  quantity: number;
  maxStock: number;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
}

export type SortOption =
  | 'relevancia'
  | 'mais-vendidos'
  | 'menor-preco'
  | 'maior-preco'
  | 'melhor-avaliacao'
  | 'mais-recentes';

export interface CatalogFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  genders: Gender[];
  priceRange: [number, number];
  minRating: number | null;
  onlyInStock: boolean;
  sort: SortOption;
  search?: string;
  page: number;
}
