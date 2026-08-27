import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-primary font-label-md">Memuat...</div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (currentUser.role !== 'admin' && currentUser.role !== 'guru') {
    return <Navigate to="/student/dashboard" replace />
  }

  return children
}

export function StudentRoute({ children }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-primary font-label-md">Memuat...</div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (currentUser.role !== 'siswa') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

export function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-primary font-label-md">Memuat...</div>
      </div>
    )
  }

  if (currentUser) {
    if (currentUser.role === 'admin' || currentUser.role === 'guru') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/student/dashboard" replace />
  }

  return children
}
