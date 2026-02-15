import { useNavigate } from 'react-router-dom'
import { Column, Row } from '@/shared/ui/design/Grid'
import { CardHeader, CardTitle } from '@/shared/ui/design/Card'
import { Card, CardContent } from '@/shared/ui/design/Card'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

const SignUpPage = () => {
  const navigate = useNavigate()

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold mt-3">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
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

export default SignUpPage

