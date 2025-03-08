import { useAuthStore } from '@common/stores/auth'
import { api } from '@lib/axios'
import { Button } from '@common/components/Button'
import { Input } from '@common/components/Input'
import { useForm } from 'react-hook-form'

type LoginFormValues = {
  email: string
  password: string
}

const Login = () => {
  const { setToken } = useAuthStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormValues>()

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post<{ access_token: string }>('/auth/login', data)
      setToken(response.data.access_token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      console.error('Error during login:', errorMessage)
      setError('root', {
        message: 'An error occurred during login. Please try again.'
      })
    }
  }

  return (
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
  )
}

export default Login
