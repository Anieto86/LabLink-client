import { Column, Row } from '@/components/design/Grid'
import { Input } from '@/components/design/Input'
import { Button } from '@/components/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/design/Card'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { BASE_URL } from '@/api'
import { useAuth } from '@/context/AuthContext'

type LoginFormValues = {
  email: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()

  // Get the page they were trying to access, if any
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormValues>()

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError('root', {
          message: result.detail || 'Login failed. Please check your credentials.'
        })
        return
      }

      if (result.access_token) {
        authLogin(result.access_token)
        navigate(from, { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('root', {
        message: 'An error occurred during login. Please try again.'
      })
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token

      try {
        // Send the access token to the backend
        const res = await fetch(`${BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ access_token: accessToken, token_type: 'bearer' })
        })

        const data = await res.json()
        if (data.access_token) {
          authLogin(data.access_token)
          navigate(from, { replace: true })
        } else {
          console.error('Token not returned from backend:', data)
          setError('root', {
            message: 'Google login failed. Please try again or use email login.'
          })
        }
      } catch (error) {
        console.error('Error sending token to backend:', error)
        setError('root', {
          message: 'An error occurred during Google login. Please try again.'
        })
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error)
      setError('root', {
        message: 'Google login failed. Please try again or use email login.'
      })
    }
  })

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="email" placeholder="Email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="Password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
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
