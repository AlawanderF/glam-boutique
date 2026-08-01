import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/utils/format';

interface CategoryData {
  category: string;
  value: number;
}

const COLORS = ['#15130f', '#b8863e', '#8a8479', '#d4c5b0', '#534d44'];

export function CategoryPieChart({ data }: { data: CategoryData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="category"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
          contentStyle={{
            border: '1px solid #e9e8e6',
            borderRadius: 2,
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <Legend
          formatter={(value) => <span className="text-xs text-ink-600">{value}</span>}
          wrapperStyle={{ paddingTop: 16 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xs text-ink-400">Total</p>
            <p className="font-display text-lg text-ink-900">{formatCurrency(total)}</p>
          </div>
        </div>
      </PieChart>
    </ResponsiveContainer>
  );
}
