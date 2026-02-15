// router.tsx
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/features/auth/routing/ProtectedRoute'
import { GuestRoute } from '@/features/auth/routing/GuestRoute'
import { AuthCheck, LoadingFallback } from '@/app/routing/helpers'
import Forms from '@/features/forms/pages/FormsPage'
import { Home } from '@/features/home/pages/HomePage'

// Layouts
const GuestLayout = lazy(() => import('@/features/auth/layouts/GuestLayout'))
const AuthenticatedLayout = lazy(() => import('@/features/navigation/layouts/AuthenticatedLayout'))

// Guest pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const SignUp = lazy(() => import('@/features/auth/pages/SignUpPage'))
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))

// Authenticated pages

const Profile = lazy(() => import('@/features/profile/pages/ProfilePage'))
const Settings = lazy(() => import('@/features/settings/pages/SettingsPage'))
const Innovation = lazy(() => import('@/features/innovation/pages/InnovationPage'))

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Guest Routes - Only accessible when NOT logged in */}
      <Route
        element={
          <GuestRoute>
            <Suspense fallback={<LoadingFallback />}>
              <GuestLayout />
            </Suspense>
          </GuestRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes - Require authentication */}
      <Route
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <AuthenticatedLayout />
            </Suspense>
          </ProtectedRoute>
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

      {/* Catch all route - Redirect to login if not authenticated, dashboard if authenticated */}
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AuthCheck authenticatedRedirect="/home" guestRedirect="/login" />
          </Suspense>
        }
      />
    </Route>
  )
)

