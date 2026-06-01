import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ScoreGauge({ value, size = 160, label = 'Average Score' }) {
  const pct = Math.min(100, Math.max(0, value));
  const remaining = 100 - pct;

  const color = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444';

  const data = [
    { value: pct },
    { value: remaining },
  ];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
        <ResponsiveContainer width="100%" height={size}>
          <PieChart>
            <Pie
              data={data}
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.28}
              outerRadius={size * 0.42}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="#E2E8F0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center" style={{ bottom: -4 }}>
          <span className="text-3xl font-bold text-slate-800">{pct}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
