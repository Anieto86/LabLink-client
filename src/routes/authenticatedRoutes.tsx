import AuthenticatedLayout from '@/app/AuthenticatedLayout'
import MindMappingLayout from '@/app/MindMappingLayout'
import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const Dashboard = lazy(() => import('@/app/layout/Dashboard'))
const Profile = lazy(() => import('@/app/pages/profile/Profile'))
const Settings = lazy(() => import('@/app/pages/settings/Settings'))
const Innovation = lazy(() => import('@/app/pages/innovation/Innovation'))
const MindMap = lazy(() => import('@/app/pages/mind-map/MindMap'))

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authenticated Layout Routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="innovationndd" element={<Innovation />} />

        {/* MindMapping Layout Routes */}
        <Route element={<MindMappingLayout />}>
          <Route path="brainstorming" element={<MindMap />} />
        </Route>
      </Route>

      {/* Catch-all Route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AuthenticatedRoutes
