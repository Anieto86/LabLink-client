import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'
import { Button } from '../../../app/components/design/Button'
import { useForm } from 'react-hook-form'
import { Input } from '../../../app/components/design/Input'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'

type LoginFormValues = {
  email: string
  password: string
}

const Login = () => {
  const { setToken } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormValues>()

  // Get the page they were trying to access, if any
  const from = location.state?.from?.pathname || '/home'

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const formData = new URLSearchParams()
      formData.append('username', data.email)
      formData.append('password', data.password)

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      if (response.status === 200) {
        const data = response.data as { access_token: string }
        setToken(data.access_token)
        navigate('/innovation', { replace: true })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      console.error('Error to login:', errorMessage)
      setError('root', {
        message: 'An error occurred during login. Please try again.'
      })
    }
  }

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
          setError('root', { message: 'Google login failed. Please try again or use email login.' })
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('Error sending token to backend:', errorMessage)
        setError('root', { message: 'An error occurred during Google login. Please try again.' })
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error)
      setError('root', { message: 'Google login failed. Please try again or use email login.' })
    }
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="email" placeholder="Email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>}
        </div>
        <div>
          <Input type="password" placeholder="Password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message?.toString()}</p>}
        </div>
        {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message?.toString()}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message?.toString()}</p>}
      <div className="mt-4 flex items-center justify-center">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => googleLogin()}>
          Sign in with Google
        </Button>
      </div>
    </>
  )
}

export default Login
