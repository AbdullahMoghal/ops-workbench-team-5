import React from 'react'

/**
 * KPI summary card matching the dashboard design.
 * trend: { value, direction: 'up'|'down', label }
 */
export default function SummaryCard({ icon, label, value, trend, loading }) {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.iconWrap}>{icon}</div>
        <span style={styles.label}>{label}</span>
      </div>
      {loading ? (
        <div style={styles.skeleton} />
      ) : (
        <div style={styles.value}>{value}</div>
      )}
      {trend && !loading && (
        <div style={styles.trend}>
          <span style={{
            color: trend.direction === 'down' ? '#15803d' : '#dc2626',
            fontWeight: 600,
            fontSize: 12,
          }}>
            {trend.direction === 'down' ? '↘' : '↗'} {trend.value}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}> {trend.label}</span>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0,
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--accent-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)',
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  value: {
    fontSize: 30,
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1.1,
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  skeleton: {
    height: 36,
    background: 'var(--border)',
    borderRadius: 4,
    animation: 'pulse 1.2s infinite',
  },
}
