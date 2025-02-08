import { lazy } from "react";
import { Route, Outlet } from "react-router-dom"; // ✅ Use react-router-dom for Route

// Lazy-loaded components for guest routes
const GuestLayout = lazy(() => import("@/components/guest/GuestLayout"));
const LoginPage = lazy(() => import("@/pages/guest/LoginPage"));
// const SignUp = lazy(() => import("@/components/guest/SignUp"));
// const ResetPassword = lazy(() => import("@/components/guest/ResetPassword"));

// ✅ Corrected guest routes structure
export const guestRoutes = (
  <Route element={<GuestLayout />}>
    <Route index element={<LoginPage />} /> {/* ✅ Default route inside GuestLayout */}
    <Route path="login" element={<LoginPage />} />
    {/* <Route path="signup" element={<SignUp />} /> */}
    {/* <Route path="reset-password" element={<ResetPassword />} /> */}
    <Route path="*" element={<Outlet />} /> {/* ✅ Ensures nested routing works properly */}
  </Route>
);
