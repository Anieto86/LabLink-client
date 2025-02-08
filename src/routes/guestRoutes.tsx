import { lazy } from 'react'
import { Route, Outlet } from 'react-router-dom'

// Lazy-loaded components for guest routes
const GuestLayout = lazy(() => import('@/components/guest/GuestLayout'))
const LoginPage = lazy(() => import('@/components/guest/loginPage/LoginPage'))
const SignUp = lazy(() => import('@/components/guest/signUp/SignUp'))
const ResetPassword = lazy(() => import('@/components/guest/resetPassword/ResetPassword'))

export const guestRoutes = (
  <Route element={<GuestLayout />}>
    <Route index element={<LoginPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="*" element={<Outlet />} />
  </Route>
)
