import MindMappingLayout from '@/app/MindMappingLayout'
import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './NotFound'

const Dashboard = lazy(() => import('@/app/layout/Dashboard'))
const Profile = lazy(() => import('@/app/pages/profile/Profile'))
const Settings = lazy(() => import('@/app/pages/settings/Settings'))
const Innovation = lazy(() => import('@/app/pages/innovation/Innovation'))
const MindMap = lazy(() => import('@/app/pages/mind-map/MindMap'))

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authenticated Layout Routes */}
      <Route path="/" element={<Dashboard />} errorElement={<NotFound />}>
        <Route path="profile" element={<Profile />} errorElement={<NotFound />} />
        <Route path="settings" element={<Settings />} errorElement={<NotFound />} />
        <Route path="innovation" element={<Innovation />} errorElement={<NotFound />} />

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
