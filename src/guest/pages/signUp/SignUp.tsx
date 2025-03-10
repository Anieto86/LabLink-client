import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/design/Card'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoaderCircle } from 'lucide-react'

// Import Google OAuth dependencies - make sure to install these
// npm install @react-oauth/google gapi-script
import { GoogleLogin } from '@react-oauth/google'
import { BASE_URL } from '@/api'
import { Column, Row } from '@/app/components/design/Grid'
import { Input } from '@/app/components/design/Input'
import { Button } from '@/app/components/design/Button'

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const SignupPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormValues>()

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setError('')
    
    try {
      // First call signup endpoint
      const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'user' // default role
        }),
      })
      
      if (!signupResponse.ok) {
        const errorData = await signupResponse.json()
        throw new Error(errorData.detail || 'Signup failed')
      }
      
      // Then login to get the token
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // API expects form data format for login
        body: new URLSearchParams({
          username: data.email, // username field is actually email in the backend
          password: data.password,
        }),
      })
      
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json()
        throw new Error(errorData.detail || 'Login failed after signup')
      }
      
      const { access_token } = await loginResponse.json()
      
      // Save token and update auth state
      login(access_token)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${BASE_URL}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: credentialResponse.credential,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Google authentication failed')
      }
      
      const { access_token } = await response.json()
      
      // Save token and update auth state
      login(access_token)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleError = () => {
    setError('Google sign-in was unsuccessful. Please try again.')
  }

  return (
    <Column className="flex min-h-screen items-center justify-center">
      <Card className="w-96 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input 
                type="text" 
                placeholder="Full Name" 
                {...register('name', { required: 'Name is required' })} 
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <Input 
                type="email" 
                placeholder="Email" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
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
                  minLength: { value: 6, message: "Password must be at least 6 characters" } 
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
          </form>
          
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center">
              <div className="flex-grow h-px bg-gray-300"/>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"/>
            </div>
            
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Row className="mt-4 text-center gap-2">
        <p className="text-gray-600">Already registered?</p>
        <p 
          className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors" 
          onClick={() => navigate('/login')}
        >
          Log in
        </p>
      </Row>
    </Column>
  )
}

export default SignupPage