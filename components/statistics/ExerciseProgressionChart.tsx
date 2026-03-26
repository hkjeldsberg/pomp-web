'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { ProgressionPoint } from '@/lib/db/statistics';

interface ExerciseProgressionChartProps {
  data: ProgressionPoint[];
  exerciseName: string;
}

export function ExerciseProgressionChart({ data, exerciseName }: ExerciseProgressionChartProps) {
  if (data.length === 0) {
    return <div className="h-52 flex items-center justify-center text-accent-muted text-sm">Ingen data for denne øvelsen</div>;
  }

  const chartData = data.map((d) => ({
    date: d.date,
    'Max vekt (kg)': d.maxWeightKg,
    'Est. 1RM (kg)': d.estimated1rm,
  }));

  return (
    <div>
      <p className="text-accent-muted text-sm font-semibold mb-3">{exerciseName}</p>
      <div className="h-52">
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
            <Legend wrapperStyle={{ color: '#5DCAA5', fontSize: 12 }} />
            <Line type="monotone" dataKey="Max vekt (kg)" stroke="#20D2AA" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Est. 1RM (kg)" stroke="#5DCAA5" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
