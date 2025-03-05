import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MindMappingLayout from '@/app/MindMappingLayout'
import NotFound from './NotFound'

const Dashboard = lazy(() => import('@/app/layout/Dashboard'))
const Profile = lazy(() => import('@/app/pages/profile/Profile'))
const Settings = lazy(() => import('@/app/pages/settings/Settings'))
const Innovation = lazy(() => import('@/app/pages/innovation/Innovation'))
const Forms = lazy(() => import('@/app/pages/forms/Forms'))
const MindMap = lazy(() => import('@/app/pages/mind-map/MindMap'))

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Root route using Dashboard as layout */}
        <Route path="/" element={<Dashboard />} errorElement={<NotFound />}>
          <Route path="innovation" element={<Innovation />} errorElement={<NotFound />} />
          <Route path="profile" element={<Profile />} errorElement={<NotFound />} />
          <Route path="settings" element={<Settings />} errorElement={<NotFound />} />
          <Route path="forms" element={<Forms />} errorElement={<NotFound />} />

          {/* Nested routes for MindMappingLayout */}
          <Route element={<MindMappingLayout />}>
            <Route path="brainstorming" element={<MindMap />} />
          </Route>
        </Route>

        {/* Catch-all route to handle 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AuthenticatedRoutes
