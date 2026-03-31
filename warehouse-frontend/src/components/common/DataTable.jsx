import React from 'react'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'

/**
 * Reusable data table component.
 * columns: [{ key, label, render?, width? }]
 * rows: array of objects
 */
export default function DataTable({ columns, rows, loading, emptyMessage, onRowClick, keyField = 'id' }) {
  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            {columns.map(col => (
              <th key={col.key} style={{ ...styles.th, width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState message={emptyMessage || 'No records found'} />
              </td>
            </tr>
          ) : (
            rows.map(row => (
              <tr
                key={row[keyField]}
                style={{
                  ...styles.bodyRow,
                  ...(onRowClick ? styles.clickable : {}),
                }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={col.key} style={styles.td}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  wrapper: {
    overflowX: 'auto',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  headerRow: {
    borderBottom: '2px solid var(--border)',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
  },
  bodyRow: {
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.1s',
  },
  td: {
    padding: '12px 14px',
    color: 'var(--text-primary)',
    verticalAlign: 'middle',
  },
  clickable: {
    cursor: 'pointer',
  },
}
