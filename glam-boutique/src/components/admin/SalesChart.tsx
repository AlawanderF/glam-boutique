import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { DailySalesPoint } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

interface SalesChartProps {
  data: DailySalesPoint[];
}

function formatDateShort(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8863e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#b8863e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e9e8e6" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateShort}
            tick={{ fontSize: 11, fill: '#8a8479' }}
            axisLine={{ stroke: '#d3d1cd' }}
            tickLine={false}
            interval={Math.ceil(data.length / 8)}
          />
          <YAxis
            tickFormatter={(value: number) => `R$${Math.round(value / 1000)}k`}
            tick={{ fontSize: 11, fill: '#8a8479' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
            labelFormatter={(label) => formatDateShort(String(label))}
            contentStyle={{
              border: '1px solid #e9e8e6',
              borderRadius: 2,
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#b8863e"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
