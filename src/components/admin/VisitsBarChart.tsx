import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BarDatum {
  label: string;
  value: number;
}

interface VisitsBarChartProps {
  data: BarDatum[];
  color?: string;
  valueLabel?: string;
}

export function VisitsBarChart({ data, color = '#15130f', valueLabel = 'Visitas' }: VisitsBarChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
          <CartesianGrid stroke="#e9e8e6" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#8a8479' }} axisLine={false} tickLine={false} />
          <YAxis
            dataKey="label"
            type="category"
            width={120}
            tick={{ fontSize: 11, fill: '#534d44' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [Number(value), valueLabel]}
            contentStyle={{ border: '1px solid #e9e8e6', borderRadius: 2, fontSize: 12, fontFamily: 'Inter, sans-serif' }}
          />
          <Bar dataKey="value" fill={color} radius={[0, 3, 3, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
