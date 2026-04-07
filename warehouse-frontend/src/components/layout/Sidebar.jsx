import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoOrange from '../../assets/17.svg'

const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/dashboard',    icon: <GridIcon />,   roles: ['Admin', 'OpsManager', 'Supervisor'] },
  { label: 'Report Issue', path: '/report-issue', icon: <PlusIcon />,   roles: ['Admin', 'OpsManager', 'Supervisor', 'WarehouseAssociate'] },
  { label: 'Review Queue', path: '/review-queue', icon: <ListIcon />,   roles: ['Admin', 'OpsManager', 'Supervisor'] },
  { label: 'Audit Trail',  path: '/audit-trail',  icon: <ShieldIcon />, roles: ['Admin', 'OpsManager', 'Supervisor'] },
  { label: 'Reports',      path: '/reports',      icon: <ChartIcon />,  roles: ['Admin', 'OpsManager', 'Supervisor'] },
  { label: 'Users & Roles',path: '/users-roles',  icon: <UsersIcon />,  roles: ['Admin'] },
  { label: 'Master Data',  path: '/master-data',  icon: <CogIcon />,    roles: ['Admin'] },
]

function NavItem({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <NavLink
      to={item.path}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px 9px 12px',
        borderRadius: 'var(--radius-sm)',
        color: isActive ? 'var(--accent)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: 14,
        fontWeight: isActive ? 600 : 500,
        textDecoration: 'none',
        background: isActive ? 'var(--accent-light)' : hovered ? '#f5f5f3' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ display: 'flex', alignItems: 'center', width: 17, flexShrink: 0 }}>{item.icon}</span>
      {item.label}
    </NavLink>
  )
}

export default function Sidebar() {
  const { role, appUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role))

  useEffect(() => {
    function handleOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [profileOpen])

  async function handleSignOut() {
    setProfileOpen(false)
    await signOut()
    navigate('/login')
  }

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <img src={logoOrange} alt="Warehouse Ops" style={styles.logoImg} />
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navSectionLabel}>MENU</div>
        {visibleItems.map(item => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Profile section */}
      <div style={styles.profileSection} ref={profileRef}>
        {/* Popup */}
        {profileOpen && (
          <div style={styles.popup}>
            <div style={styles.popupHeader}>
              <div style={styles.popupAvatar}>{getInitials(appUser?.fullName || 'U')}</div>
              <div style={{ minWidth: 0 }}>
                <div style={styles.popupName}>{appUser?.fullName || 'User'}</div>
                <div style={styles.popupEmail}>{appUser?.email || ''}</div>
              </div>
            </div>
            <div style={styles.popupDivider} />
            <div style={{ padding: '8px 14px' }}>
              <span style={styles.roleBadge}>{role}</span>
            </div>
            <div style={styles.popupDivider} />
            <button
              style={styles.popupSignOut}
              onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={handleSignOut}
            >
              <LogoutIcon />
              Sign out
            </button>
          </div>
        )}

        {/* Clickable profile row */}
        <button
          style={{
            ...styles.profileBtn,
            background: profileOpen ? '#f5f5f3' : 'transparent',
          }}
          onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = '#f5f5f3' }}
          onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = 'transparent' }}
          onClick={() => setProfileOpen(o => !o)}
        >
          <div style={styles.avatar}>{getInitials(appUser?.fullName || 'U')}</div>
          <div style={styles.profileInfo}>
            <div style={styles.profileName}>{appUser?.fullName || 'User'}</div>
            <div style={styles.profileRole}>{role}</div>
          </div>
          <div style={{ ...styles.chevron, transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <ChevronIcon />
          </div>
        </button>
      </div>
    </aside>
  )
}

function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    minHeight: '100vh',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px 20px',
    borderBottom: '1px solid var(--border)',
  },
  logoImg: {
    height: 38,
    width: 'auto',
    display: 'block',
  },
  nav: {
    flex: 1,
    padding: '16px 8px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
  },
  navSectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    padding: '0 14px 8px',
    textTransform: 'uppercase',
  },
  profileSection: {
    position: 'relative',
    borderTop: '1px solid var(--border)',
  },
  popup: {
    position: 'absolute',
    bottom: '100%',
    left: 8,
    right: 8,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    zIndex: 200,
  },
  popupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px',
  },
  popupAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  popupName: {
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  popupEmail: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  popupDivider: {
    height: 1,
    background: 'var(--border)',
  },
  roleBadge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'var(--accent-light)',
    color: 'var(--accent)',
  },
  popupSignOut: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '10px 14px',
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.12s',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '14px 12px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    borderRadius: 0,
    transition: 'background 0.12s',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontWeight: 600,
    fontSize: 13,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileRole: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-muted)',
    transition: 'transform 0.2s',
    flexShrink: 0,
  },
}

function GridIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
function PlusIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> }
function ListIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
function ShieldIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function ChartIcon()  { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function UsersIcon()  { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> }
function CogIcon()    { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }
function LogoutIcon() { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function ChevronIcon() { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg> }
