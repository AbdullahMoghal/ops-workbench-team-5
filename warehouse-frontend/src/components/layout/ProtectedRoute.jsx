import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

/**
 * Wraps a route so only authenticated users can access it.
 * Optionally accepts allowedRoles to enforce RBAC at the route level.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { session, loading, role } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner fullPage />

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
