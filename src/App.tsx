import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from './routes/ErrorBoundaryFallback'

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
