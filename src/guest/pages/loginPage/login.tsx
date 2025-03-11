import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'
import { Button } from '../../../app/components/design/Button'
import { useForm } from 'react-hook-form'
import { Input } from '../../../app/components/design/Input'
import { useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { SignUpButton } from '../signUpPage/SignUpButton'

type LoginFormValues = {
  email: string
  password: string
}

export default function Login() {
  const { setToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    googleLogin,
    isLoading: isGoogleLoading,
    error: googleError
  } = useGoogleAuth({
    redirectPath: '/home'
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<LoginFormValues & { root: string }>() // Añadido tipo para error root

  const combinedIsLoading = isLoading || isGoogleLoading
  const errorMessage = errors.root?.message || googleError

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    clearErrors('root')

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
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { detail?: string } }; message?: string }

        // Error general
        setError('root', {
          message: errorObj.response?.data?.detail || errorObj.message || 'Authentication failed'
        })

        // Errores específicos
        if (errorObj.response?.data?.detail?.includes('Incorrect email or password')) {
          setError('email', { message: 'Invalid credentials' })
          setError('password', { message: 'Invalid credentials' })
        }
      } else {
        setError('root', { message: 'An unknown error occurred' })
      }
    } finally {
      setIsLoading(false)
    }
  }

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

        <Button type="submit" className="w-full" disabled={combinedIsLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Log in'
          )}
        </Button>

        <SignUpButton googleLogin={googleLogin} combinedIsLoading={combinedIsLoading} errorMessage={errorMessage} />
      </form>
    </>
  )
}
