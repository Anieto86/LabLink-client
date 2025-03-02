import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface GuestRouteProps {
  children: ReactNode
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const isAuthenticated = localStorage.getItem('authToken') !== null

  if (isAuthenticated) {
    // If user is authenticated, redirect to dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
