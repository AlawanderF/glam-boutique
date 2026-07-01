export type OrderStatus = 'processando' | 'enviado' | 'entregue' | 'cancelado';

export interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingSteps: { label: string; done: boolean; date?: string }[];
}

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    number: 'GB482910',
    date: '2026-06-10',
    status: 'entregue',
    total: 489.9,
    items: [
      {
        name: 'Vestido Midi Alfaiataria',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop',
        quantity: 1,
        price: 489.9,
      },
    ],
    trackingSteps: [
      { label: 'Pedido confirmado', done: true, date: '10/06' },
      { label: 'Em preparação', done: true, date: '11/06' },
      { label: 'Enviado', done: true, date: '12/06' },
      { label: 'Entregue', done: true, date: '15/06' },
    ],
  },
  {
    id: 'ord-2',
    number: 'GB471203',
    date: '2026-06-16',
    status: 'enviado',
    total: 638.9,
    items: [
      {
        name: 'Tênis Runner Performance',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
        quantity: 1,
        price: 349.9,
      },
      {
        name: 'Moletom Essential Oversized',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&auto=format&fit=crop',
        quantity: 1,
        price: 189.9,
      },
    ],
    trackingSteps: [
      { label: 'Pedido confirmado', done: true, date: '16/06' },
      { label: 'Em preparação', done: true, date: '17/06' },
      { label: 'Enviado', done: true, date: '18/06' },
      { label: 'Entregue', done: false },
    ],
  },
  {
    id: 'ord-3',
    number: 'GB465588',
    date: '2026-06-19',
    status: 'processando',
    total: 159.9,
    items: [
      {
        name: 'Óculos de Sol Acetato Redondo',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300&auto=format&fit=crop',
        quantity: 1,
        price: 159.9,
      },
    ],
    trackingSteps: [
      { label: 'Pedido confirmado', done: true, date: '19/06' },
      { label: 'Em preparação', done: false },
      { label: 'Enviado', done: false },
      { label: 'Entregue', done: false },
    ],
  },
];
