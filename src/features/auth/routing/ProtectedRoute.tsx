import { Navigate, useLocation } from 'react-router-dom'
import { useAuthSession } from '@/features/auth/state/AuthSessionProvider'
import type { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuthSession()

  if (isBootstrapping) {
    return <div className="p-6">Loading session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
