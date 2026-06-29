import type { DailySalesPoint } from '@/types/admin';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Gera 30 dias de vendas mock com leve tendência de crescimento e variação de fim de semana.
export function generateDailySales(days = 30): DailySalesPoint[] {
  const points: DailySalesPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = 1800 + (days - i) * 22;
    const noise = seededRandom(i * 13.37) * 900;
    const weekendBoost = isWeekend ? 600 : 0;
    const revenue = Math.round(base + noise + weekendBoost);
    const orders = Math.max(3, Math.round(revenue / (220 + seededRandom(i * 7.1) * 80)));

    points.push({
      date: date.toISOString().slice(0, 10),
      revenue,
      orders,
    });
  }

  return points;
}

export const dailySales = generateDailySales(30);

export const topSellingProducts = [
  { name: 'Vestido Midi Alfaiataria', revenue: 18840, unitsSold: 42 },
  { name: 'Tênis Runner Performance', revenue: 16450, unitsSold: 47 },
  { name: 'Moletom Essential Oversized', revenue: 12480, unitsSold: 68 },
  { name: 'Jaqueta Couro Ecológico Clássica', revenue: 11475, unitsSold: 25 },
  { name: 'Camisa Social Slim Listrada', revenue: 9230, unitsSold: 42 },
];

export const trafficSources = [
  { source: 'Busca orgânica', visits: 1840, percent: 38 },
  { source: 'Instagram', visits: 1320, percent: 27 },
  { source: 'Direto', visits: 860, percent: 18 },
  { source: 'WhatsApp', visits: 510, percent: 11 },
  { source: 'Outros', visits: 290, percent: 6 },
];
