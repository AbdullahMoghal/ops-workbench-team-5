import React from 'react'

const STATUS_CONFIG = {
  new:           { label: 'New',            bg: 'var(--status-new)',           color: 'var(--status-new-text)' },
  pending_review:{ label: 'Pending Review', bg: 'var(--status-pending)',       color: 'var(--status-pending-text)' },
  in_progress:   { label: 'In Progress',    bg: 'var(--status-in-progress)',   color: 'var(--status-in-progress-text)' },
  escalated:     { label: 'Escalated',      bg: 'var(--status-escalated)',     color: 'var(--status-escalated-text)' },
  resolved:      { label: 'Resolved',       bg: 'var(--status-resolved)',      color: 'var(--status-resolved-text)' },
  rejected:      { label: 'Rejected',       bg: 'var(--status-rejected)',      color: 'var(--status-rejected-text)' },
  closed:        { label: 'Closed',         bg: 'var(--status-closed)',        color: 'var(--status-closed-text)' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#f3f4f6', color: '#374151' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        background: cfg.color,
        flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}
