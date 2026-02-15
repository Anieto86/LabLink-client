// router.tsx
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingFallback } from '@/app/routing/helpers'
import Forms from '@/features/forms/pages/FormsPage'
import { Home } from '@/features/home/pages/HomePage'

const AuthenticatedLayout = lazy(() => import('@/features/navigation/layouts/AuthenticatedLayout'))

const Profile = lazy(() => import('@/features/profile/pages/ProfilePage'))
const Settings = lazy(() => import('@/features/settings/pages/SettingsPage'))
const Innovation = lazy(() => import('@/features/innovation/pages/InnovationPage'))

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AuthenticatedLayout />
          </Suspense>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forms" element={<Forms />} />
      </Route>

      {/* Root route redirection */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Route>
  )
)

