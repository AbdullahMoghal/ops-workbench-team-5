import React from 'react'

const PRIORITY_CONFIG = {
  low:      { label: 'Low',      bg: 'var(--priority-low)',      color: 'var(--priority-low-text)' },
  medium:   { label: 'Medium',   bg: 'var(--priority-medium)',   color: 'var(--priority-medium-text)' },
  high:     { label: 'High',     bg: 'var(--priority-high)',     color: 'var(--priority-high-text)' },
  critical: { label: 'Critical', bg: 'var(--priority-critical)', color: 'var(--priority-critical-text)' },
}

export default function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || { label: priority, bg: '#f3f4f6', color: '#374151' }
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}
