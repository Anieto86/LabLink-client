import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface GuestRouteProps {
  children: ReactNode
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const isAuthenticated = localStorage.getItem('token') !== null

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
