import { Navigate, useLocation } from 'react-router-dom'
import { useAuthSession } from '@/features/auth/state/AuthSessionProvider'
import type { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuthSession()

  // Infra Step 3: mientras se valida sesion al iniciar, no renderizamos rutas privadas.
  if (isBootstrapping) {
    return <div className="p-6">Loading session...</div>
  }

  // Infra Step 4: firewall de UI; si no hay sesion valida, se redirige a login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
