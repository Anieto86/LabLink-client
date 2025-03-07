import React from 'react'
import { Link } from 'react-router-dom'

type ErrorBoundaryFallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h1>
      <p className="my-2 text-gray-700">{error.message}</p>
      <Link to="/" className="text-blue-500">
        <button type="button" onClick={resetErrorBoundary} className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white" aria-label="Try again">
          Try again
        </button>
      </Link>
    </div>
  )
}
