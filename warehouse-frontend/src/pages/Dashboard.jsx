import React, { useEffect, useState } from 'react'
import SummaryCard from '../components/charts/SummaryCard'
import StatusPieChart from '../components/charts/StatusPieChart'
import PatternBarChart from '../components/charts/PatternBarChart'
import { dashboardApi } from '../api/dashboardApi'
import { auditApi } from '../api/auditApi'
import StatusBadge from '../components/common/StatusBadge'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardApi.getSummary().catch(() => null),
      auditApi.getGlobal(0, 8).catch(() => []),
    ]).then(([s, logs]) => {
      setSummary(s)
      setRecentLogs(logs || [])
      setLoading(false)
    })
  }, [])

  // Fall back to static demo data if backend is offline
  const data = summary || {
    openExceptions: 127,
    avgResolutionHours: 4.2,
    totalDiscrepancyValue: 42500,
    resolutionRate: 85,
    statusBreakdown: { resolved: 52, pending_review: 32, in_progress: 20, escalated: 13 },
    patternsByType: [
      { type: 'Missing Label', count: 24 },
      { type: 'Damaged', count: 18 },
      { type: 'Wrong SKU', count: 12 },
      { type: 'Expiry', count: 29 },
      { type: 'System Error', count: 14 },
    ],
  }

  const patternData = (data.patternsByType || []).map(p => ({
    type: p.type || p.ticketType,
    count: p.count,
  }))

  return (
    <div>
      {/* Actions row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 24 }}>
        <button className="btn btn-outline btn-sm">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Last 30 Days
        </button>
        <button className="btn btn-primary btn-sm">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <SummaryCard
          loading={loading}
          icon={<ClockIcon />}
          label="Avg Resolution Time"
          value={`${data.avgResolutionHours} Hours`}
          trend={{ value: '5%', direction: 'down', label: 'vs last month' }}
        />
        <SummaryCard
          loading={loading}
          icon={<AlertIcon />}
          label="Open Exceptions"
          value={data.openExceptions?.toLocaleString()}
          trend={{ value: '12%', direction: 'up', label: 'vs last month' }}
        />
        <SummaryCard
          loading={loading}
          icon={<DollarIcon />}
          label="Discrepancy Value"
          value={`$${Number(data.totalDiscrepancyValue || 0).toLocaleString()}`}
          trend={{ value: '2.5%', direction: 'up', label: 'vs last month' }}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Recurring Issue Patterns</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Breakdown by exception type</div>
            </div>
          </div>
          <PatternBarChart data={patternData} />
        </div>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Resolution Status</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status distribution of open tickets</div>
          </div>
          <StatusPieChart data={data.statusBreakdown} />
        </div>
      </div>

      {/* Recent Audit Trail */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent Activity</div>
        {recentLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No recent activity</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentLogs.map(log => (
              <div key={log.id} style={logStyle}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent)', marginTop: 5, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {log.ticketNumber && (
                      <span style={{ color: 'var(--accent)', marginRight: 6 }}>{log.ticketNumber}</span>
                    )}
                    {log.action.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {log.user?.fullName} · {formatTime(log.timestamp)}
                  </div>
                  {log.details && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{log.details}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const logStyle = {
  display: 'flex',
  gap: 12,
  paddingBottom: 12,
  borderBottom: '1px solid var(--border)',
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function ClockIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function AlertIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function DollarIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
}
