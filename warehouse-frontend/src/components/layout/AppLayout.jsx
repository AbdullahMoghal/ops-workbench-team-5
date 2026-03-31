import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div style={styles.shell}>
      <Sidebar />
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
    flex: 1,
    padding: '32px',
    maxWidth: '100%',
    overflowX: 'hidden',
  },
}
