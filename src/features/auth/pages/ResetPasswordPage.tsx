import { Column, Row } from '@/shared/ui/design/Grid'
import { Input } from '@/shared/ui/design/Input'
import { Button } from '@/shared/ui/design/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type ResetPasswordFormValues = {
  email: string
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormValues>()

  const onSubmit = (data: ResetPasswordFormValues) => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('Reset Password Data:', data)
  }

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="email" placeholder="Enter your email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Row className="mt-4 text-center gap-2">
        <p className="text-gray-600">Remembered your password?</p>
        <p className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors" onClick={() => navigate('/login')}>
          Log in
        </p>
      </Row>
    </Column>
  )
}

export default ResetPasswordPage

