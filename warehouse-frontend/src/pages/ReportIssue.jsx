import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { adminApi } from '../api/adminApi'
import { ticketsApi } from '../api/ticketsApi'
import { useAuth } from '../context/AuthContext'

const ISSUE_TYPES = [
  'Missing Item', 'Damaged Goods', 'Count Mismatch',
  'Wrong Location', 'Wrong SKU', 'System Error',
  'Expiry Issue', 'Missing Label',
]

export default function ReportIssue() {
  const { appUser } = useAuth()
  const [locations, setLocations] = useState([])
  const [items, setItems] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { quantity: 0, estimatedValueImpact: 0 }
  })

  useEffect(() => {
    Promise.all([
      adminApi.listLocations().catch(() => []),
      adminApi.listInventoryItems().catch(() => []),
    ]).then(([locs, itms]) => {
      setLocations(locs || [])
      setItems(itms || [])
    })
  }, [])

  async function onSubmit(data) {
    setApiError('')
    setSubmitting(true)
    try {
      const ticket = await ticketsApi.create({
        locationId: data.locationId,
        inventoryItemId: data.inventoryItemId,
        ticketType: data.ticketType,
        title: `${data.ticketType} – ${items.find(i => i.id === data.inventoryItemId)?.sku || 'Unknown'}`,
        description: data.description,
        quantity: Number(data.quantity),
        estimatedValueImpact: Number(data.estimatedValueImpact || 0),
      })
      setSuccess(ticket)
      reset()
    } catch (err) {
      setApiError(err.message)
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div>
        <div className="page-header">
          <h1>Report Inventory Issue</h1>
          <p>Log discrepancies and process exceptions found on the warehouse floor.</p>
        </div>
        <div className="card" style={{ maxWidth: 600, textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Ticket Submitted</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
            Your exception has been logged and is now in the supervisor review queue.
          </p>
          <div style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            fontWeight: 800,
            fontSize: 22,
            padding: '12px 24px',
            borderRadius: 8,
            display: 'inline-block',
            margin: '12px 0',
          }}>
            {success.ticketNumber}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Priority auto-assigned: <strong>{success.priority?.toUpperCase()}</strong>
          </p>
          <button className="btn btn-primary" onClick={() => setSuccess(null)}>
            Report Another Issue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Report Inventory Issue</h1>
        <p>Log discrepancies and process exceptions found on the warehouse floor directly to the operations team.</p>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            {/* SKU / Item */}
            <div className="form-group">
              <label className="form-label" htmlFor="inventoryItemId">
                SKU / Product ID
              </label>
              <select
                id="inventoryItemId"
                className="form-select"
                {...register('inventoryItemId', { required: 'SKU is required' })}
              >
                <option value="">Scan or enter SKU</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.sku} – {item.itemName}
                  </option>
                ))}
              </select>
              {errors.inventoryItemId && <span className="form-error">{errors.inventoryItemId.message}</span>}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="locationId">Bin Location</label>
              <select
                id="locationId"
                className="form-select"
                {...register('locationId', { required: 'Location is required' })}
              >
                <option value="">e.g., A-12-04</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.displayLabel || `${loc.zone}-${loc.bin}`}
                  </option>
                ))}
              </select>
              {errors.locationId && <span className="form-error">{errors.locationId.message}</span>}
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 20 }}>
            {/* Issue Type */}
            <div className="form-group">
              <label className="form-label" htmlFor="ticketType">Issue Type</label>
              <select
                id="ticketType"
                className="form-select"
                {...register('ticketType', { required: 'Issue type is required' })}
              >
                <option value="">Select issue category</option>
                {ISSUE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.ticketType && <span className="form-error">{errors.ticketType.message}</span>}
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantity Affected</label>
              <input
                id="quantity"
                type="number"
                min="0"
                className="form-input"
                {...register('quantity', { min: { value: 0, message: 'Cannot be negative' } })}
              />
              {errors.quantity && <span className="form-error">{errors.quantity.message}</span>}
            </div>
          </div>

          {/* Estimated Value */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" htmlFor="estimatedValueImpact">
              Estimated Value Impact ($) <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>optional</span>
            </label>
            <input
              id="estimatedValueImpact"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              {...register('estimatedValueImpact')}
            />
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" htmlFor="description">Operational Notes</label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Describe the issue in detail or add any relevant context..."
              rows={4}
              {...register('description')}
            />
          </div>

          {apiError && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
              {apiError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Ticket →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
