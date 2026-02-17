import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Input } from '@/shared/ui/design/Input'
import { Button } from '@/shared/ui/design/Button'
import { Column } from '@/shared/ui/design/Grid'
import { useAuthSession } from '@/features/auth/state/AuthSessionProvider'
import type { ApiError } from '@/shared/lib/apiClient'

const TEST_ADMIN_EMAIL = import.meta.env.TEST_ADMIN_EMAIL || ''
const TEST_ADMIN_PASSWORD = import.meta.env.TEST_ADMIN_PASSWORD || ''
const TEST_AUTH_BYPASS = String(import.meta.env.TEST_AUTH_BYPASS || '').toLowerCase() === 'true'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isBootstrapping, isAuthenticated } = useAuthSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const hasTestCredentials = Boolean(TEST_ADMIN_EMAIL && TEST_ADMIN_PASSWORD)

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      navigate('/laboratories', { replace: true })
    }
  }, [isBootstrapping, isAuthenticated, navigate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login({ email, password })
      navigate('/laboratories', { replace: true })
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Column className="min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {hasTestCredentials ? (
              <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                {TEST_AUTH_BYPASS ? <p className="text-blue-700">Modo test local habilitado.</p> : null}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => {
                    setEmail(TEST_ADMIN_EMAIL)
                    setPassword(TEST_ADMIN_PASSWORD)
                  }}
                >
                  Usar credenciales de test
                </Button>
              </div>
            ) : null}
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
            <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" required />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Column>
  )
}

export default LoginPage
