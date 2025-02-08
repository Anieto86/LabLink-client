import { lazy } from "react";
import { Route } from "react-router-dom"; // ✅ Use `react-router-dom`
import AuthenticatedLayout from "@/components/app/AuthenticatedLayout";

const Dashboard = lazy(() => import("@/pages/app/dashboard/Dashboard"));
// const Profile = lazy(() => import("@/components/app/Profile"));
// const Settings = lazy(() => import("@/components/app/Settings"));

export const authenticatedRoutes = (
  <Route element={<AuthenticatedLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    {/* <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} /> */}
  </Route>
);
