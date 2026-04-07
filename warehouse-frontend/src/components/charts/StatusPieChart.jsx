import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = {
  resolved:       '#e85d04',
  pending_review: '#f59e0b',
  in_progress:    '#3b82f6',
  escalated:      '#ef4444',
  new:            '#8b5cf6',
  rejected:       '#6b7280',
  closed:         '#9ca3af',
}

const STATUS_LABELS = {
  resolved:       'Resolved',
  pending_review: 'Pending',
  in_progress:    'In Progress',
  escalated:      'Escalated',
  new:            'New',
  rejected:       'Rejected',
  closed:         'Closed',
}

export default function StatusPieChart({ data }) {
  const chartData = Object.entries(data || {})
    .map(([key, count]) => ({
      name: STATUS_LABELS[key] || key,
      value: count,
      color: COLORS[key] || '#9ca3af',
    }))
    .filter(d => d.value > 0)

  const total = chartData.reduce((s, d) => s + d.value, 0)
  const addressedPct = total > 0
    ? Math.round(((data?.resolved || 0) + (data?.closed || 0)) / total * 100)
    : 0

  return (
    <div style={{ width: '100%' }}>
      {/* Donut chart */}
      <div style={{ position: 'relative', width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} Tickets`, name]}
              contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — absolutely centered within the donut */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{addressedPct}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Addressed</div>
        </div>
      </div>

      {/* Legend below chart */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12, justifyContent: 'center' }}>
        {chartData.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: entry.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {entry.name} <span style={{ color: 'var(--text-muted)' }}>({entry.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
