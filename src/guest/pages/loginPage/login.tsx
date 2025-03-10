import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'
import { Button } from '../../../app/components/design/Button'
import { useForm } from 'react-hook-form'
import { Input } from '../../../app/components/design/Input'
import { useNavigate } from 'react-router-dom'
type LoginFormValues = {
  email: string
  password: string
}

const Login = () => {
  const { setToken } = useAuthStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormValues>()

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
