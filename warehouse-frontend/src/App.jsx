import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import ReviewQueue from './pages/ReviewQueue'
import TicketDetail from './pages/TicketDetail'
import AuditTrail from './pages/AuditTrail'
import Reports from './pages/Reports'
import UsersRoles from './pages/UsersRoles'
import MasterData from './pages/MasterData'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected app shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['Admin', 'OpsManager', 'Supervisor']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="report-issue" element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          } />

          <Route path="review-queue" element={
            <ProtectedRoute allowedRoles={['Admin', 'OpsManager', 'Supervisor']}>
              <ReviewQueue />
            </ProtectedRoute>
          } />

          <Route path="tickets/:id" element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          } />

          <Route path="audit-trail" element={
            <ProtectedRoute allowedRoles={['Admin', 'OpsManager', 'Supervisor']}>
              <AuditTrail />
            </ProtectedRoute>
          } />

          <Route path="reports" element={
            <ProtectedRoute allowedRoles={['Admin', 'OpsManager', 'Supervisor']}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="users-roles" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UsersRoles />
            </ProtectedRoute>
          } />

          <Route path="master-data" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <MasterData />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
