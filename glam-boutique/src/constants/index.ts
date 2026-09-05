export const BRAND = {
  name: 'Glam Boutique',
  slogan: 'Elegância que veste sua história',
  tagline: 'Moda autêntica, curadoria exclusiva',
  cnpjPlaceholder: '00.000.000/0001-00',
} as const;

export const STORE_ADDRESS = {
  street: 'Rua Quinze de Novembro',
  number: '100',
  complement: 'Sala 100',
  neighborhood: 'Centro',
  city: 'Guarabira',
  state: 'PB',
  zipCode: '58200-000',
  full: 'Rua Quinze de Novembro, 100 - Sala 100, Centro, Guarabira - PB',
  mapsQuery: 'Rua Quinze de Novembro, 100, Centro, Guarabira - PB',
} as const;

export const CONTACT = {
  whatsapp: '+55 83 9999-0000',
  email: 'contato@glamboutique.com.br',
  hours: 'Seg. a Sáb. · 9h às 19h',
} as const;

export const FREE_SHIPPING_THRESHOLD = 299;

export const ROUTES = {
  home: '/',
  catalog: '/catalogo',
  catalogByCategory: (slug: string) => `/catalogo/${slug}`,
  product: (slug: string) => `/produto/${slug}`,
  cart: '/carrinho',
  checkout: '/checkout',
  account: '/conta',
  accountOrders: '/conta/pedidos',
  accountWishlist: '/conta/favoritos',
  accountProfile: '/conta/perfil',
  login: '/entrar',
  register: '/cadastro',
  forgotPassword: '/recuperar-senha',
  privacyPolicy: '/privacidade',
  termsOfUse: '/termos',
  exchangePolicy: '/trocas',
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  tiktok: 'https://tiktok.com',
  pinterest: 'https://pinterest.com',
} as const;
