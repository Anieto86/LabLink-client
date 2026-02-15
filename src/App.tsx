import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/routing/router'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from './app/routing/ErrorBoundaryFallback'

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryFallback}
      onReset={() => {
        location.reload()
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App

