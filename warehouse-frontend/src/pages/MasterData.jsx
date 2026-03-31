import React, { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import Modal from '../components/common/Modal'
import DataTable from '../components/common/DataTable'
import { useForm } from 'react-hook-form'

export default function MasterData() {
  const [tab, setTab] = useState('locations')
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  async function load() {
    setLoading(true)
    const [locs, cats, itms] = await Promise.all([
      adminApi.listLocations().catch(() => []),
      adminApi.listCategories().catch(() => []),
      adminApi.listInventoryItems().catch(() => []),
    ])
    setLocations(locs || [])
    setCategories(cats || [])
    setItems(itms || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    reset({})
    setModal({ type: tab, mode: 'create' })
  }

  function openEdit(row) {
    reset(tab === 'locations'
      ? { warehouse: row.warehouse, zone: row.zone, bin: row.bin, status: row.status }
      : { categoryName: row.categoryName, description: row.description })
    setModal({ type: tab, mode: 'edit', id: row.id })
  }

  async function onSave(data) {
    setSaving(true)
    try {
      if (modal.type === 'locations') {
        modal.mode === 'create'
          ? await adminApi.createLocation(data)
          : await adminApi.updateLocation(modal.id, data)
      } else if (modal.type === 'categories') {
        modal.mode === 'create'
          ? await adminApi.createCategory(data)
          : await adminApi.updateCategory(modal.id, data)
      }
      setModal(null)
      load()
    } catch {}
    setSaving(false)
  }

  const locationColumns = [
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'zone', label: 'Zone' },
    { key: 'bin', label: 'Bin' },
    { key: 'displayLabel', label: 'Display Label', render: (_, row) => row.displayLabel || `${row.zone}-${row.bin}` },
    { key: 'status', label: 'Status', render: v => <StatusChip status={v} /> },
    { key: 'id', label: 'Actions', width: 70, render: (_, row) => <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => openEdit(row)}>Edit</button> },
  ]

  const categoryColumns = [
    { key: 'categoryName', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'id', label: 'Actions', width: 70, render: (_, row) => <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => openEdit(row)}>Edit</button> },
  ]

  const itemColumns = [
    { key: 'sku', label: 'SKU', render: v => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{v}</span> },
    { key: 'itemName', label: 'Item Name' },
    { key: 'categoryName', label: 'Category' },
  ]

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Master Data &amp; Configuration</h1>
          <p>Manage locations, categories, and inventory items.</p>
        </div>
        {tab !== 'items' && (
          <button className="btn btn-primary" onClick={openCreate}>+ Add {tab === 'locations' ? 'Location' : 'Category'}</button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid var(--border)' }}>
        {[
          { key: 'locations', label: 'Locations' },
          { key: 'categories', label: 'Categories' },
          { key: 'items', label: 'Inventory Items' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 20px', fontSize: 14, fontWeight: 600,
              color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {t.label} <span style={{ marginLeft: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              ({t.key === 'locations' ? locations.length : t.key === 'categories' ? categories.length : items.length})
            </span>
          </button>
        ))}
      </div>

      {tab === 'locations' && (
        <DataTable columns={locationColumns} rows={locations} loading={loading} emptyMessage="No locations found." />
      )}
      {tab === 'categories' && (
        <DataTable columns={categoryColumns} rows={categories} loading={loading} emptyMessage="No categories found." />
      )}
      {tab === 'items' && (
        <DataTable columns={itemColumns} rows={items} loading={loading} emptyMessage="No items found." />
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? `Add ${modal?.type === 'locations' ? 'Location' : 'Category'}` : 'Edit'}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {modal?.type === 'locations' && (
              <>
                <div className="form-group">
                  <label className="form-label">Warehouse</label>
                  <input className="form-input" placeholder="e.g. WH-MAIN" {...register('warehouse', { required: 'Required' })} />
                  {errors.warehouse && <span className="form-error">{errors.warehouse.message}</span>}
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Zone</label>
                    <input className="form-input" placeholder="A" {...register('zone', { required: 'Required' })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bin</label>
                    <input className="form-input" placeholder="A-12-04" {...register('bin', { required: 'Required' })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" {...register('status')}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}
            {modal?.type === 'categories' && (
              <>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input className="form-input" {...register('categoryName', { required: 'Required' })} />
                  {errors.categoryName && <span className="form-error">{errors.categoryName.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2} {...register('description')} />
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function StatusChip({ status }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
      background: status === 'active' ? '#dcfce7' : '#f3f4f6',
      color: status === 'active' ? '#15803d' : '#6b7280',
    }}>{status}</span>
  )
}
