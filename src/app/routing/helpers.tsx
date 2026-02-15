import { Navigate } from "react-router-dom";

// Loading fallback
export const LoadingFallback = () => <div className="flex items-center justify-center w-full h-screen">Loading...</div>;

// Helper component to conditionally redirect based on authentication status
export const AuthCheck = ({ authenticatedRedirect, guestRedirect }: { authenticatedRedirect: string, guestRedirect: string }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return <Navigate to={isAuthenticated ? authenticatedRedirect : guestRedirect} replace />;
};
