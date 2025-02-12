import AuthenticatedLayout from '@/components/app/AuthenticatedLayout'
import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'

const Dashboard = lazy(() => import('@/components/app/pages/dashboard/Dashboard'))
const Profile = lazy(() => import('@/components/app/pages/profile/Profile'))
const Settings = lazy(() => import('@/components/app/pages/settings/Settings'))
const Innovation = lazy(() => import('@/components/app/pages/innovation/Innovation'))
const Brainstorming = lazy(() => import('@/components/app/pages/brainstorming/Brainstorming'))

export const authenticatedRoutes = (
  <Route element={<AuthenticatedLayout />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="innovation" element={<Innovation />} />
    <Route path="brainstorming" element={<Brainstorming />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
)
