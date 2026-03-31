import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketsApi } from '../api/ticketsApi'
import { dashboardApi } from '../api/dashboardApi'
import { adminApi } from '../api/adminApi'
import DataTable from '../components/common/DataTable'
import StatusBadge from '../components/common/StatusBadge'
import PriorityBadge from '../components/common/PriorityBadge'
import Modal from '../components/common/Modal'
import SummaryCard from '../components/charts/SummaryCard'

export default function ReviewQueue() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', priority: '' })
  const [assignModal, setAssignModal] = useState(null) // { ticketId, ticketNumber }
  const [selectedUser, setSelectedUser] = useState('')

  async function load() {
    setLoading(true)
    const [tks, st, usrs] = await Promise.all([
      ticketsApi.list(filters).catch(() => []),
      dashboardApi.getQueueStats().catch(() => null),
      adminApi.listUsers().catch(() => []),
    ])
    setTickets(tks || [])
    setStats(st)
    setUsers(usrs || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filters])

  const fallbackStats = {
    totalExceptions: tickets.length || 142,
    assigned: stats?.assigned ?? 89,
    unassigned: stats?.unassigned ?? 53,
    resolvedToday: stats?.resolvedToday ?? 12,
  }

  const columns = [
    {
      key: 'ticketNumber', label: 'ID', width: 90,
      render: (v) => <span style={{ color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>{v}</span>,
    },
    {
      key: 'ticketType', label: 'Type',
      render: (v) => v,
    },
    {
      key: 'location', label: 'Location',
      render: (_, row) => row.location?.displayLabel || row.location?.bin || '—',
    },
    {
      key: 'createdAt', label: 'Date Reported',
      render: (v) => v ? new Date(v).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
    },
    {
      key: 'priority', label: 'Priority', width: 100,
      render: (v) => <PriorityBadge priority={v} />,
    },
    {
      key: 'status', label: 'Status', width: 140,
      render: (v) => <StatusBadge status={v} />,
    },
    {
      key: 'assignedTo', label: 'Assigned To', width: 130,
      render: (v) => v
        ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {v.fullName?.split(' ').map(p => p[0]).join('').slice(0, 2)}
            </span>
            {v.fullName?.split(' ')[0]}
          </span>
        : <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>,
    },
    {
      key: 'id', label: 'Action', width: 90,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {!row.assignedTo ? (
            <button
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
              onClick={e => { e.stopPropagation(); setAssignModal(row); setSelectedUser('') }}
            >
              Assign
            </button>
          ) : (
            <button
              className="btn btn-ghost btn-sm"
              onClick={e => { e.stopPropagation(); navigate(`/tickets/${row.id}`) }}
            >
              Review
            </button>
          )}
        </div>
      ),
    },
  ]

  async function handleAssign() {
    if (!selectedUser || !assignModal) return
    await ticketsApi.assign(assignModal.id, selectedUser).catch(() => {})
    setAssignModal(null)
    load()
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Supervisor Review Queue</h1>
          <p>Manage inventory discrepancies, assign tasks to associates, and process system exceptions.</p>
        </div>
        <button className="btn btn-primary">↓ Bulk Export</button>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <SummaryCard icon={<AlertIcon />} label="Total Exceptions" value={fallbackStats.totalExceptions} />
        <SummaryCard icon={<PersonIcon />} label="Assigned" value={fallbackStats.assigned} />
        <SummaryCard icon={<UnassignIcon />} label="Unassigned" value={fallbackStats.unassigned} trend={{ value: '+12% new', direction: 'up', label: '' }} />
        <SummaryCard icon={<CheckIcon />} label="Resolved Today" value={fallbackStats.resolvedToday} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 140 }}
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">Status: All</option>
          <option value="new">New</option>
          <option value="pending_review">Pending Review</option>
          <option value="in_progress">In Progress</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 140 }}
          value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
        >
          <option value="">Priority: All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ status: '', priority: '' })}>
          Clear Filters
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={tickets}
        loading={loading}
        onRowClick={row => navigate(`/tickets/${row.id}`)}
        emptyMessage="No tickets match your filters."
      />

      <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 12 }}>
        Showing {tickets.length} result{tickets.length !== 1 ? 's' : ''}
      </div>

      {/* Assign modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign ${assignModal?.ticketNumber}`}>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Assign to user</label>
          <select className="form-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">Select a user</option>
            {users.filter(u => ['Supervisor', 'OpsManager'].includes(u.roleName)).map(u => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.roleName})</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setAssignModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedUser}>Assign</button>
        </div>
      </Modal>
    </div>
  )
}

function AlertIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> }
function PersonIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function UnassignIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="23" y2="12"/><line x1="23" y1="8" x2="19" y2="12"/></svg> }
function CheckIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> }
