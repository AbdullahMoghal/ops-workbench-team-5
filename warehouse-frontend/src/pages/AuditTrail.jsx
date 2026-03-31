import React, { useEffect, useState } from 'react'
import { auditApi } from '../api/auditApi'
import DataTable from '../components/common/DataTable'

export default function AuditTrail() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    auditApi.getGlobal(page, 50).then(data => {
      setLogs(data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [page])

  const filtered = logs.filter(log => {
    const q = search.toLowerCase()
    return !q ||
      log.action?.toLowerCase().includes(q) ||
      log.user?.fullName?.toLowerCase().includes(q) ||
      log.ticketNumber?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q)
  })

  const ACTION_COLORS = {
    TICKET_CREATED: '#3b82f6',
    TICKET_ASSIGNED: '#8b5cf6',
    STATUS_CHANGED: '#f59e0b',
    TICKET_ESCALATED: '#ef4444',
    TICKET_RESOLVED: '#22c55e',
    TICKET_CLOSED: '#6b7280',
    ADJUSTMENT_APPROVED: '#22c55e',
    ADJUSTMENT_REJECTED: '#ef4444',
    NOTE_ADDED: '#0ea5e9',
    DISCREPANCY_LOGGED: '#f97316',
  }

  const columns = [
    {
      key: 'timestamp', label: 'Timestamp', width: 160,
      render: (v) => new Date(v).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
    },
    {
      key: 'ticketNumber', label: 'Ticket', width: 100,
      render: (v) => v ? <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{v}</span> : '—',
    },
    {
      key: 'user', label: 'User', width: 140,
      render: (v) => v?.fullName || '—',
    },
    {
      key: 'action', label: 'Action', width: 180,
      render: (v) => (
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          background: `${ACTION_COLORS[v] || '#9ca3af'}22`,
          color: ACTION_COLORS[v] || '#6b7280',
        }}>
          {v?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'details', label: 'Details',
      render: (v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v || '—'}</span>,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>System Audit Trail</h1>
        <p>Complete log of all workflow actions across all tickets.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: 360 }}
          placeholder="Search by action, user, or ticket ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} entries
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyMessage="No audit log entries found."
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
          ← Previous
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>Page {page + 1}</span>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={logs.length < 50}>
          Next →
        </button>
      </div>
    </div>
  )
}
