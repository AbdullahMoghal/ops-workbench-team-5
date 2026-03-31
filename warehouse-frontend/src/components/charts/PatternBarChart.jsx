import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function PatternBarChart({ data }) {
  // data: [{ type: 'Missing Label', count: 24 }, ...]
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis
            dataKey="type"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
            cursor={{ fill: 'rgba(232,93,4,0.06)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {(data || []).map((entry, i) => (
              <Cell key={i} fill={i % 2 === 0 ? '#e85d04' : '#fdba74'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
