import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingFallback } from '@/app/routing/helpers'
import { ProtectedRoute } from '@/features/auth/routing/ProtectedRoute'
import { LoginPage } from '@/features/auth'
import { LaboratoriesPage } from '@/features/laboratories'
import { ResourcesPage } from '@/features/resources'
import { ReservationsPage } from '@/features/reservations'

const AuthenticatedLayout = lazy(() =>
  import('@/features/navigation').then((module) => ({ default: module.AuthenticatedLayout }))
)

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <AuthenticatedLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route path="/laboratories" element={<LaboratoriesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/laboratories" replace />} />

      <Route path="*" element={<Navigate to="/laboratories" replace />} />
    </Route>
  )
)

