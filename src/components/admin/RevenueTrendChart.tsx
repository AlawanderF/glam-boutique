import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/utils/format';

interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#e9e8e6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#8a8479' }}
          axisLine={{ stroke: '#d3d1cd' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => `R$${Math.round(v / 1000)}k`}
          tick={{ fontSize: 11, fill: '#8a8479' }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'revenue' ? formatCurrency(Number(value)) : String(value),
            name === 'revenue' ? 'Receita' : 'Pedidos'
          ]}
          contentStyle={{
            border: '1px solid #e9e8e6',
            borderRadius: 2,
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#b8863e"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#15130f"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
