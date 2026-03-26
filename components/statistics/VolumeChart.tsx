'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { VolumePoint } from '@/lib/db/statistics';

interface VolumeChartProps {
  data: VolumePoint[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  if (data.length === 0) {
    return <div className="h-44 flex items-center justify-center text-accent-muted text-sm">Ikke nok data</div>;
  }

  const chartData = data.map((d) => ({ date: d.date, kg: d.volumeKg }));

  return (
    <div>
      <p className="text-accent-muted text-sm font-semibold mb-3">Totalvolum per økt (kg)</p>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,210,170,0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#5DCAA5', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#5DCAA5', fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1F1D', border: '1px solid rgba(32,210,170,0.2)', borderRadius: 8 }}
              labelStyle={{ color: '#E0F5F0' }}
              itemStyle={{ color: '#20D2AA' }}
            />
            <Line type="monotone" dataKey="kg" stroke="#20D2AA" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
