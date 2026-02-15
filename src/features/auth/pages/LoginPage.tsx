import { Column, Row } from '@/shared/ui/design/Grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { useNavigate } from 'react-router-dom'

import LoginForm from '@/features/auth/components/LoginForm'

const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold ">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
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

