import React, { useState, useEffect } from 'react'
import { reportsApi } from '../api/reportsApi'
import DataTable from '../components/common/DataTable'
import StatusBadge from '../components/common/StatusBadge'
import PriorityBadge from '../components/common/PriorityBadge'

export default function Reports() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ status: '', priority: '', from: '', to: '' })

  function load() {
    setLoading(true)
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (filters.from) params.from = new Date(filters.from).toISOString()
    if (filters.to) params.to = new Date(filters.to).toISOString()

    reportsApi.history(params).then(data => {
      setTickets(data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const totalValue = tickets.reduce((s, t) => s + Number(t.estimatedValueImpact || 0), 0)
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

  function exportCSV() {
    // TODO: replace with backend /api/reports/export endpoint for large datasets
    const headers = ['Ticket #', 'Type', 'Status', 'Priority', 'Location', 'SKU', 'Value Impact', 'Created']
    const rows = tickets.map(t => [
      t.ticketNumber, t.ticketType, t.status, t.priority,
      t.location?.displayLabel, t.inventoryItem?.sku,
      t.estimatedValueImpact, new Date(t.createdAt).toLocaleDateString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'warehouse-report.csv'; a.click()
  }

  const columns = [
    { key: 'ticketNumber', label: 'Ticket #', width: 100, render: v => <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{v}</span> },
    { key: 'ticketType', label: 'Type' },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'priority', label: 'Priority', render: v => <PriorityBadge priority={v} /> },
    { key: 'location', label: 'Location', render: (_, row) => row.location?.displayLabel || '—' },
    { key: 'inventoryItem', label: 'SKU', render: (_, row) => row.inventoryItem?.sku || '—' },
    {
      key: 'estimatedValueImpact', label: 'Value Impact',
      render: v => <span style={{ color: Number(v) > 0 ? '#dc2626' : 'var(--text-primary)' }}>
        {v ? `-$${Number(v).toFixed(2)}` : '—'}
      </span>
    },
    {
      key: 'createdAt', label: 'Created',
      render: v => new Date(v).toLocaleDateString()
    },
  ]

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Historical Reports</h1>
          <p>Filter, review, and export historical exception data.</p>
        </div>
        <button className="btn btn-primary" onClick={exportCSV}>↓ Export CSV</button>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        {[
          { label: 'Total Tickets', value: tickets.length },
          { label: 'Resolved/Closed', value: resolved },
          { label: 'Total Value Impact', value: `$${totalValue.toFixed(2)}` },
          { label: 'Resolution Rate', value: tickets.length ? `${Math.round(resolved / tickets.length * 100)}%` : '—' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: 1, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <select className="form-select" style={{ width: 'auto' }} value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
          <option value="escalated">Escalated</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input type="date" className="form-input" style={{ width: 160 }} value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
        <input type="date" className="form-input" style={{ width: 160 }} value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
        <button className="btn btn-primary btn-sm" onClick={load}>Apply Filters</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ status: '', priority: '', from: '', to: '' }); }}>Clear</button>
      </div>

      <DataTable
        columns={columns}
        rows={tickets}
        loading={loading}
        emptyMessage="No tickets match the selected filters."
      />
    </div>
  )
}
