import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

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
  resolved: 'Resolved',
  pending_review: 'Pending',
  in_progress: 'In Progress',
  escalated: 'Escalated',
  new: 'New',
  rejected: 'Rejected',
  closed: 'Closed',
}

export default function StatusPieChart({ data }) {
  // data: { resolved: 52, pending_review: 32, in_progress: 20, escalated: 13 }
  const chartData = Object.entries(data || {}).map(([key, count]) => ({
    name: STATUS_LABELS[key] || key,
    value: count,
    color: COLORS[key] || '#9ca3af',
    rawKey: key,
  })).filter(d => d.value > 0)

  const total = chartData.reduce((s, d) => s + d.value, 0)
  const addressedPct = total > 0
    ? Math.round(((data?.resolved || 0) + (data?.closed || 0)) / total * 100)
    : 0

  return (
    <div style={{ width: '100%', height: 260, position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="40%"
            cy="50%"
            innerRadius={70}
            outerRadius={105}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} Tickets`, name]}
            contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry) => (
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {value} – {entry.payload.value} Tickets
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{addressedPct}%</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Addressed</div>
      </div>
    </div>
  )
}
