import { Input } from '@/app/components/design/Input'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { SignUpButton } from './SignUpButton'

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const SignUp = () => {
  const { setToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

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
    watch,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<SignupFormValues & { root: string }>()

  const combinedIsLoading = isLoading || isGoogleLoading
  const errorMessage = errors.root?.message || googleError

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    clearErrors('root')

    try {
      try {
        // First call signup endpoint
        await api.post('/auth/signup', {
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'user' // default role
        })

        // Then login to get the token
        const formData = new URLSearchParams()
        formData.append('username', data.email) // username field is actually email in the backend
        formData.append('password', data.password)

        const loginResponse = await api.post('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        const { access_token } = loginResponse.data as { access_token: string }

        // Save token and update auth state
        setToken(access_token)

        // Redirect to dashboard
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const errorObj = err as { response?: { data?: { detail?: string } }; message?: string }
          // Usar setError de RHF para errores generales
          setError('root', {
            message: errorObj.response?.data?.detail || errorObj.message || 'An unknown error occurred'
          })

          // Si hay errores específicos de campo, podemos establecerlos también
          if (errorObj.response?.data?.detail?.includes('email already registered')) {
            setError('email', { message: 'Email already registered' })
          }
        } else {
          setError('root', { message: 'An unknown error occurred' })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="text" placeholder="Full Name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email', {
              //TODO: add email validation with zod
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
        <SignUpButton googleLogin={googleLogin} combinedIsLoading={combinedIsLoading} errorMessage={errorMessage} />
      </form>
    </>
  )
}
