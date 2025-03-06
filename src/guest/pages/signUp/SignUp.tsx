import { Column, Row } from '@/app/components/design/Grid'
import { Input } from '@/app/components/design/Input'
import { Button } from '@/app/components/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/design/Card'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type SignupFormValues = {
  email: string
  password: string
  confirmPassword: string
}

const SignupPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormValues>()

  const onSubmit = (data: SignupFormValues) => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('Signup Data:', data)
  }

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="email" placeholder="Email" {...register('email', { required: 'Email is required' })} />
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
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-center">
            <Button variant="outline" className="w-full flex items-center gap-2">
              Sign up with Google
            </Button>
          </div>
        </CardContent>
      </Card>

      <Row className="mt-4 text-center gap-2">
        <p className="text-gray-600">Already registered?</p>
        <p className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors" onClick={() => navigate('/login')}>
          Log in
        </p>
      </Row>
    </Column>
  )
}

export default SignupPage
