import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div style={styles.shell}>
      <Sidebar />
      <TopBar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    marginLeft: 'var(--sidebar-width)',
    marginTop: 'var(--topbar-height)',
    flex: 1,
    padding: '28px 32px',
    maxWidth: '100%',
    overflowX: 'hidden',
  },
}
