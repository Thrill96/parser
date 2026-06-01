'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const SERIES = [
  { key: 'overall_score', color: '#5b9dff', name: 'Overall' },
  { key: 'chatgpt_score', color: '#36c98e', name: 'ChatGPT' },
  { key: 'claude_score', color: '#f5b945', name: 'Claude' },
  { key: 'gemini_score', color: '#c98ef0', name: 'Gemini' },
  { key: 'perplexity_score', color: '#ef5f6b', name: 'Perplexity' },
];

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="muted">No history yet — trend appears after your first few scans.</div>;
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#283142" strokeDasharray="3 3" />
          <XAxis dataKey="score_date" stroke="#95a0b5" fontSize={11} />
          <YAxis domain={[0, 100]} stroke="#95a0b5" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: '#141925',
              border: '1px solid #283142',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.key === 'overall_score' ? 2.5 : 1.5}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
