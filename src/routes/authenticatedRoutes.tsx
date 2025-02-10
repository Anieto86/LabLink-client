import AuthenticatedLayout from '@/components/app/AuthenticatedLayout'
import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom' // ✅ Use `react-router-dom`

const Dashboard = lazy(() => import('@/components/app/dashboard/Dashboard'))
const Profile = lazy(() => import('@/components/app/profile/Profile'))
const Settings = lazy(() => import('@/components/app/settings/Settings'))

export const authenticatedRoutes = (
  <Route element={<AuthenticatedLayout />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
)
