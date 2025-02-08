import AuthenticatedLayout from "@/components/app/AuthenticatedLayout";
import { lazy } from "react";
import { Route } from "react-router-dom"; // ✅ Use `react-router-dom`

const Dashboard = lazy(() => import("@/components/app/dashboard/Dashboard"));
// const Profile = lazy(() => import("@/components/app/Profile"));
// const Settings = lazy(() => import("@/components/app/Settings"));

export const authenticatedRoutes = (
  <Route element={<AuthenticatedLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    {/* <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} /> */}
  </Route>
);
