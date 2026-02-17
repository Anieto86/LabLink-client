import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/routing/router'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from './app/routing/ErrorBoundaryFallback'
import { AuthSessionProvider } from '@/features/auth/state/AuthSessionProvider'

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryFallback}
      onReset={() => {
        location.reload()
      }}
    >
      {/* Infra Step 1: session provider envuelve todo el router para exponer auth global. */}
      <AuthSessionProvider>
        <RouterProvider router={router} />
      </AuthSessionProvider>
    </ErrorBoundary>
  )
}

export default App

