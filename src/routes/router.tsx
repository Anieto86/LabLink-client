// router.tsx
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/routes/ProtectedRoutes'
import { GuestRoute } from '@/routes/guestRoutes'
import { AuthCheck, LoadingFallback } from '@/routes/helpers'
import Forms from '@/app/pages/forms/Forms'
import { Home } from '@/app/pages/homepage/Home'
// import { Home } from '@/guest/pages/Home'

// Layouts
const GuestLayout = lazy(() => import('@/guest/layouts/GuestLayout'))
const AuthenticatedLayout = lazy(() => import('@/app/layout/AuthenticatedLayout'))
const MindMappingLayout = lazy(() => import('@/app/layout/MindMappingLayout'))

// Guest pages
const LoginPage = lazy(() => import('@/guest/pages/loginPage/LoginPage'))
const SignUp = lazy(() => import('@/guest/pages/signUpPage/SignUpPage'))
const ResetPassword = lazy(() => import('@/guest/pages/resetPassword/ResetPassword'))

// Authenticated pages

const Profile = lazy(() => import('@/app/pages/profile/Profile'))
const Settings = lazy(() => import('@/app/pages/settings/Settings'))
const Innovation = lazy(() => import('@/app/pages/innovation/Innovation'))
const MindMap = lazy(() => import('@/app/pages/mind-map/MindMap'))

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

      {/* Mind Mapping Layout - Protected */}
      <Route
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <MindMappingLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route path="/brainstorming" element={<MindMap />} />
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
