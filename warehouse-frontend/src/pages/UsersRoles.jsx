import React, { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import DataTable from '../components/common/DataTable'
import Modal from '../components/common/Modal'
import { useForm } from 'react-hook-form'

export default function UsersRoles() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | user obj (edit)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  async function load() {
    const [u, r] = await Promise.all([
      adminApi.listUsers().catch(() => []),
      adminApi.listRoles().catch(() => []),
    ])
    setUsers(u || [])
    setRoles(r || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    reset({ fullName: '', email: '', roleId: '', status: 'active' })
    setModal('create')
  }

  function openEdit(user) {
    reset({
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
    })
    setModal(user)
  }

  async function onSave(data) {
    setSaving(true)
    setApiError('')
    try {
      if (modal === 'create') {
        await adminApi.createUser(data)
      } else {
        await adminApi.updateUser(modal.id, data)
      }
      setModal(null)
      load()
    } catch (err) {
      setApiError(err.message)
    }
    setSaving(false)
  }

  const columns = [
    {
      key: 'fullName', label: 'Name',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {v?.split(' ').map(p => p[0]).join('').slice(0, 2)}
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'roleName', label: 'Role' },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: v === 'active' ? '#dcfce7' : '#f3f4f6',
          color: v === 'active' ? '#15803d' : '#6b7280',
        }}>{v}</span>
      ),
    },
    {
      key: 'createdAt', label: 'Joined',
      render: v => new Date(v).toLocaleDateString(),
    },
    {
      key: 'id', label: 'Actions', width: 80,
      render: (_, row) => (
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => openEdit(row)}>
          Edit
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Users &amp; Roles</h1>
          <p>Manage user accounts and role assignments.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add User</button>
      </div>

      {/* Role summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {roles.map(role => {
          const count = users.filter(u => u.roleName === role.name).length
          return (
            <div key={role.id} className="card" style={{ flex: 1, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{role.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role.description}</div>
            </div>
          )
        })}
      </div>

      <DataTable columns={columns} rows={users} loading={loading} emptyMessage="No users found." />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add New User' : 'Edit User'}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" {...register('fullName', { required: 'Required' })} />
              {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" {...register('email', { required: 'Required' })} disabled={modal !== 'create'} />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" {...register('roleId', { required: 'Required' })}>
                <option value="">Select role</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {errors.roleId && <span className="form-error">{errors.roleId.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {apiError && <div style={{ color: '#dc2626', fontSize: 13 }}>{apiError}</div>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
