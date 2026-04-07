import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':    { title: 'Visibility Dashboard',   sub: 'Overview of warehouse operations and exception tracking' },
  '/report-issue': { title: 'Report Inventory Issue',  sub: 'Log discrepancies and exceptions found on the floor' },
  '/review-queue': { title: 'Supervisor Review Queue', sub: 'Manage exceptions, assign tasks, and process resolutions' },
  '/audit-trail':  { title: 'System Audit Trail',      sub: 'Complete log of all workflow actions across all tickets' },
  '/reports':      { title: 'Reports & Analytics',     sub: 'Historical trends and exception pattern analysis' },
  '/users-roles':  { title: 'Users & Roles',           sub: 'Manage user accounts and access permissions' },
  '/master-data':  { title: 'Master Data',             sub: 'Manage locations, categories, and inventory items' },
}

function getPageMeta(pathname) {
  if (pathname.startsWith('/tickets/')) return { title: 'Ticket Detail', sub: 'Review and act on this exception ticket' }
  return PAGE_TITLES[pathname] || { title: 'Warehouse Ops', sub: '' }
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function TopBar() {
  const { pathname } = useLocation()
  const { appUser, role } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const meta = getPageMeta(pathname)

  return (
    <header style={styles.bar}>
      {/* Left: page title */}
      <div style={styles.left}>
        <div style={styles.pageTitle}>{meta.title}</div>
        {meta.sub && <div style={styles.pageSub}>{meta.sub}</div>}
      </div>

      {/* Right: date + notification */}
      <div style={styles.right}>
        {/* Date pill */}
        <div style={styles.datePill}>
          <CalendarIcon />
          <span>{formatDate()}</span>
        </div>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={styles.iconBtn}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f3'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => setNotifOpen(o => !o)}
            title="Notifications"
          >
            <BellIcon />
            <span style={styles.notifDot} />
          </button>

          {notifOpen && (
            <div style={styles.notifPopup}>
              <div style={styles.notifHeader}>Notifications</div>
              <div style={styles.notifItem}>
                <div style={styles.notifDotInline} />
                <div>
                  <div style={styles.notifText}>3 tickets require review</div>
                  <div style={styles.notifTime}>Just now</div>
                </div>
              </div>
              <div style={styles.notifItem}>
                <div style={{ ...styles.notifDotInline, background: '#f59e0b' }} />
                <div>
                  <div style={styles.notifText}>EX-1009 escalated to critical</div>
                  <div style={styles.notifTime}>5 minutes ago</div>
                </div>
              </div>
              <div style={styles.notifItem}>
                <div style={{ ...styles.notifDotInline, background: '#22c55e' }} />
                <div>
                  <div style={styles.notifText}>EX-1001 resolved by Mike Rivera</div>
                  <div style={styles.notifTime}>1 hour ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* User badge */}
        <div style={styles.userBadge}>
          <div style={styles.userAvatar}>
            {getInitials(appUser?.fullName || 'U')}
          </div>
          <div style={styles.userMeta}>
            <div style={styles.userName}>{appUser?.fullName || 'User'}</div>
            <div style={styles.userRole}>{role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}

function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

const styles = {
  bar: {
    position: 'fixed',
    top: 0,
    left: 'var(--sidebar-width)',
    right: 0,
    height: 'var(--topbar-height)',
    background: '#ffffff',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    zIndex: 90,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  pageSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    lineHeight: 1.2,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  datePill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: 'var(--bg-page)',
    borderRadius: 20,
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontWeight: 500,
    border: '1px solid var(--border)',
  },
  iconBtn: {
    position: 'relative',
    width: 34,
    height: 34,
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'background 0.12s',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--accent)',
    border: '1.5px solid #fff',
  },
  notifPopup: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 280,
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    zIndex: 300,
  },
  notifHeader: {
    padding: '12px 14px 8px',
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 14px',
    borderBottom: '1px solid var(--border)',
  },
  notifDotInline: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
    marginTop: 4,
  },
  notifText: { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' },
  notifTime: { fontSize: 11, color: 'var(--text-muted)', marginTop: 2 },
  divider: {
    width: 1,
    height: 28,
    background: 'var(--border)',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: 10,
    color: 'var(--text-muted)',
  },
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}
