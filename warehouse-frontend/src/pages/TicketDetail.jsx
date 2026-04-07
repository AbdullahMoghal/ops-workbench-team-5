import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketsApi } from '../api/ticketsApi'
import { notesApi } from '../api/notesApi'
import { auditApi } from '../api/auditApi'
import { discrepanciesApi } from '../api/discrepanciesApi'
import { adminApi } from '../api/adminApi'
import StatusBadge from '../components/common/StatusBadge'
import PriorityBadge from '../components/common/PriorityBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Modal from '../components/common/Modal'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canApproveAdjustments, appUser } = useAuth()

  const [ticket, setTicket] = useState(null)
  const [discrepancy, setDiscrepancy] = useState(null)
  const [notes, setNotes] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [actionModal, setActionModal] = useState(null) // 'escalate'|'close'|'approve'|'reject'
  const [actionLoading, setActionLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [assignModal, setAssignModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')

  const { register, handleSubmit: handleApprovalSubmit, formState: { errors: approvalErrors } } = useForm()

  async function load() {
    const [tkt, nts, logs, usrs] = await Promise.all([
      ticketsApi.getById(id).catch(() => null),
      notesApi.list(id).catch(() => []),
      auditApi.getByTicket(id).catch(() => []),
      adminApi.listUsers().catch(() => []),
    ])
    setTicket(tkt)
    setNotes(nts || [])
    setAuditLogs(logs || [])
    setUsers(usrs || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function addNote(e) {
    e.preventDefault()
    if (!noteText.trim()) return
    setAddingNote(true)
    await notesApi.create(id, noteText).catch(() => {})
    setNoteText('')
    setAddingNote(false)
    load()
  }

  async function handleEscalate() {
    setActionLoading(true)
    await ticketsApi.escalate(id, 'Escalated by supervisor').catch(() => {})
    setActionModal(null)
    setActionLoading(false)
    load()
  }

  async function handleClose() {
    setActionLoading(true)
    await ticketsApi.close(id).catch(() => {})
    setActionModal(null)
    setActionLoading(false)
    load()
  }

  async function handleApprove(data) {
    setActionLoading(true)
    try {
      if (!discrepancy) {
        // create a stub discrepancy if needed
        const d = await discrepanciesApi.create({
          ticketId: id,
          itemId: ticket.inventoryItem?.id,
          expectedQty: ticket.quantity || 0,
          actualQty: 0,
          varianceValue: ticket.estimatedValueImpact || 0,
        })
        await discrepanciesApi.approve(d.id, { justification: data.justification })
      } else {
        await discrepanciesApi.approve(discrepancy.id, { justification: data.justification })
      }
    } catch {}
    setActionModal(null)
    setActionLoading(false)
    load()
  }

  async function handleReject(data) {
    setActionLoading(true)
    try {
      if (discrepancy) {
        await discrepanciesApi.reject(discrepancy.id, { justification: data.justification })
      } else {
        await ticketsApi.changeStatus(id, 'rejected', data.justification)
      }
    } catch {}
    setActionModal(null)
    setActionLoading(false)
    load()
  }

  async function handleAssign() {
    if (!selectedUser) return
    setActionLoading(true)
    await ticketsApi.assign(id, selectedUser).catch(() => {})
    setAssignModal(false)
    setActionLoading(false)
    load()
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!ticket) return <div style={{ padding: 40 }}>Ticket not found.</div>

  const isClosed = ticket.status === 'closed'

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
        <span style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => navigate('/review-queue')}>
          Exceptions
        </span>
        {' › '}
        <span style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => navigate('/review-queue')}>
          Resolution Queue
        </span>
        {' › '}
        <span>#{ticket.ticketNumber}</span>
      </div>

      {/* Title row */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>
              Exception {ticket.ticketNumber}: {ticket.ticketType}
            </h1>
            <PriorityBadge priority={ticket.priority} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Location: {ticket.location?.displayLabel || ticket.location?.bin} &nbsp;|&nbsp;
            SKU: {ticket.inventoryItem?.sku} &nbsp;|&nbsp;
            Created: {new Date(ticket.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/review-queue')}>
          ← Back to List
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Item Details card */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Item Details</h3>
              <StatusBadge status={ticket.status} />
            </div>
            <div style={detailGrid}>
              <div><div style={detailLabel}>ITEM NAME</div><div style={detailValue}>{ticket.inventoryItem?.itemName}</div></div>
              <div><div style={detailLabel}>SKU</div><div style={detailValue}>{ticket.inventoryItem?.sku}</div></div>
              <div><div style={detailLabel}>CATEGORY</div><div style={detailValue}>{ticket.inventoryItem?.categoryName || ticket.categoryName || '—'}</div></div>
              <div><div style={detailLabel}>BIN LOCATION</div><div style={detailValue}>{ticket.location?.displayLabel}</div></div>
              <div><div style={detailLabel}>STATUS</div><div style={detailValue}><StatusBadge status={ticket.status} /></div></div>
              <div><div style={detailLabel}>ASSIGNED TO</div><div style={detailValue}>{ticket.assignedTo?.fullName || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</div></div>
            </div>
          </div>

          {/* Discrepancy counts */}
          {ticket.quantity > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={detailLabel}>System Count</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{ticket.quantity}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expected</div>
              </div>
              <div className="card" style={{ padding: 16, border: '2px solid var(--accent)' }}>
                <div style={{ ...detailLabel, color: 'var(--accent)' }}>Physical Count</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>
                  {ticket.quantity - (discrepancy?.variance ? Math.abs(discrepancy.variance) : 0)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent)' }}>Reported</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div style={detailLabel}>Value Impact</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626' }}>
                  -${Number(ticket.estimatedValueImpact || 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Notes thread */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Notes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {notes.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No notes yet.</p>}
              {notes.map(note => (
                <div key={note.id} style={noteStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={avatarSmall}>{note.user?.fullName?.[0]}</span>
                    <strong style={{ fontSize: 13 }}>{note.user?.fullName}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatTime(note.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{note.noteText}</p>
                </div>
              ))}
            </div>
            {!isClosed && (
              <form onSubmit={addNote} style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a note…"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={addingNote || !noteText.trim()}>
                  Add
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column — Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Timeline of Events</h3>
              <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Export Log</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {auditLogs.map((log, i) => (
                <div key={log.id} style={timelineItem}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i === 0 ? 'var(--accent)' : 'var(--border)',
                    border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                    flexShrink: 0, marginTop: 4,
                  }} />
                  <div>
                    <div style={{ fontSize: 11, color: i === 0 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                      {formatTime(log.timestamp)}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{log.action.replace(/_/g, ' ')}</div>
                    {log.details && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{log.details}</p>}
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No activity yet.</p>}
            </div>
          </div>

          {/* Quick Actions */}
          {!isClosed && (
            <div className="card" style={{ padding: 16 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {!ticket.assignedTo && (
                  <button className="btn btn-outline" style={{ justifyContent: 'center' }} onClick={() => setAssignModal(true)}>
                    Assign Ticket
                  </button>
                )}
                <button className="btn btn-outline" style={{ justifyContent: 'center' }} onClick={() => setActionModal('escalate')}>
                  Escalate
                </button>
                {canApproveAdjustments && (
                  <>
                    <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setActionModal('approve')}>
                      ✓ Approve Resolution
                    </button>
                    <button className="btn btn-danger" style={{ justifyContent: 'center' }} onClick={() => setActionModal('reject')}>
                      Deny
                    </button>
                  </>
                )}
                <button className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: 12 }} onClick={() => setActionModal('close')}>
                  Close Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action modals */}
      <Modal open={actionModal === 'escalate'} onClose={() => setActionModal(null)} title="Escalate Ticket">
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          This will escalate the ticket to the operations manager for review.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleEscalate} disabled={actionLoading}>
            {actionLoading ? 'Escalating…' : 'Escalate'}
          </button>
        </div>
      </Modal>

      <Modal open={actionModal === 'close'} onClose={() => setActionModal(null)} title="Close Ticket">
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Once closed, this ticket cannot be edited. It will remain available in the audit trail.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleClose} disabled={actionLoading}>
            {actionLoading ? 'Closing…' : 'Close Ticket'}
          </button>
        </div>
      </Modal>

      <Modal open={actionModal === 'approve'} onClose={() => setActionModal(null)} title="Approve Resolution">
        <form onSubmit={handleApprovalSubmit(handleApprove)}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Justification *</label>
            <textarea className="form-textarea" rows={3}
              placeholder="Enter approval justification..."
              {...register('justification', { required: 'Required' })} />
            {approvalErrors.justification && <span className="form-error">{approvalErrors.justification.message}</span>}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Actions will be logged to the audit trail immediately.
            </span>
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Approving…' : 'Approve Resolution'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={actionModal === 'reject'} onClose={() => setActionModal(null)} title="Deny / Reject">
        <form onSubmit={handleApprovalSubmit(handleReject)}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Reason for Rejection *</label>
            <textarea className="form-textarea" rows={3}
              placeholder="Enter rejection reason..."
              {...register('justification', { required: 'Required' })} />
            {approvalErrors.justification && <span className="form-error">{approvalErrors.justification.message}</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger" disabled={actionLoading}>
              {actionLoading ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign Ticket">
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Assign to</label>
          <select className="form-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">Select user</option>
            {users.filter(u => ['Supervisor', 'OpsManager'].includes(u.roleName)).map(u => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.roleName})</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setAssignModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedUser || actionLoading}>Assign</button>
        </div>
      </Modal>
    </div>
  )
}

const detailGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '16px 12px',
}
const detailLabel = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  letterSpacing: '0.04em',
  marginBottom: 3,
}
const detailValue = { fontSize: 14, fontWeight: 500 }
const noteStyle = {
  background: 'var(--bg-page)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px',
}
const avatarSmall = {
  width: 22, height: 22, borderRadius: '50%',
  background: 'var(--accent)', color: 'white',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 11, fontWeight: 700,
}
const timelineItem = {
  display: 'flex',
  gap: 12,
  paddingBottom: 16,
  borderLeft: '2px solid var(--border)',
  paddingLeft: 12,
  marginLeft: 5,
}

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
