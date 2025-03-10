import { useState } from 'react'
import { Column, Row } from '@/app/components/design/Grid'
import { Button } from '@/app/components/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/design/Card'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import Login from './Login'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  // Get the page they were trying to access, if any
  const from = location.state?.from?.pathname || '/home'

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token

      try {
        // Send the access token to the backend using axios
        const res = await api.post<{ access_token: string }>('/auth/google', {
          access_token: accessToken,
          token_type: 'bearer'
        })

        if (res.data.access_token) {
          setToken(res.data.access_token)
          navigate(from, { replace: true })
        } else {
          console.error('Token not returned from backend:', res.data)
          setError('Google login failed. Please try again or use email login.')
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('Error sending token to backend:', errorMessage)
        setError('An error occurred during Google login. Please try again.')
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error)
      setError('Google login failed. Please try again or use email login.')
    }
  })

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold ">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Login />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="mt-4 flex items-center justify-center">
            <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => googleLogin()}>
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>

      <Row className="mt-4 text-center gap-2">
        <p className="text-gray-600">Not registered yet?</p>
        <p className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors" onClick={() => navigate('/signup')}>
          Sign Up
        </p>
      </Row>
      <Row className="mt-4 text-center gap-2">
        <p className="text-gray-600">Forgot password?</p>
        <p className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors" onClick={() => navigate('/reset-password')}>
          Reset Password
        </p>
      </Row>
    </Column>
  )
}

export default LoginPage
