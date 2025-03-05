import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MindMappingLayout from '@/app/MindMappingLayout'
import NotFound from './NotFound'

const Dashboard = lazy(() => import('@/app/layout/Dashboard'))
const Profile = lazy(() => import('@/app/pages/profile/Profile'))
const Settings = lazy(() => import('@/app/pages/settings/Settings'))
const Innovation = lazy(() => import('@/app/pages/innovation/Innovation'))
const MindMap = lazy(() => import('@/app/pages/mind-map/MindMap'))

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Ruta raíz que usa Dashboard como layout */}
        <Route path="/" element={<Dashboard />} errorElement={<NotFound />}>
          <Route path="profile" element={<Profile />} errorElement={<NotFound />} />
          <Route path="settings" element={<Settings />} errorElement={<NotFound />} />
          <Route path="innovation" element={<Innovation />} errorElement={<NotFound />} />

          {/* Rutas anidadas para MindMappingLayout */}
          <Route element={<MindMappingLayout />}>
            <Route path="brainstorming" element={<MindMap />} />
          </Route>
        </Route>

        {/* Ruta catch-all para manejar 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AuthenticatedRoutes
