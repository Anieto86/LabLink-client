import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'
import { Button } from '../../../app/components/design/Button'
import { useForm } from 'react-hook-form'
import { Input } from '../../../app/components/design/Input'
import { useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

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
    clearErrors('root') // Limpiar errores previos

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

        {/* Mostrar errores generales */}
        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>}

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

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <Button
            type="button"
            onClick={() => {
              clearErrors('root')
              googleLogin()
            }}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            disabled={combinedIsLoading}
          >
            Sign up with Google
          </Button>
        </div>
      </form>
    </>
  )
}
