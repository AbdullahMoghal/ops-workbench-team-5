import React from 'react'
import Modal from './Modal'

export default function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  confirmStyle = 'btn-primary',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
        <button className={`btn ${confirmStyle}`} onClick={onConfirm} disabled={loading}>
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
