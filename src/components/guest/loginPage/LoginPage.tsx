import { Column, Row } from '@/components/design/Grid'
import { Input } from '@/components/design/Input'
import { Button } from '@/components/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/design/Card'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type LoginFormValues = {
  email: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>()

  const onSubmit = (data: LoginFormValues) => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('Login Data:', data)
  }

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
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-center">
            <Button variant="outline" className="w-full flex items-center gap-2">
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
