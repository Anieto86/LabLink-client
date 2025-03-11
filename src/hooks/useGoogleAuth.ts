// src/hooks/useGoogleAuth.ts
import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth'
import { useGoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface UseGoogleAuthOptions {
  redirectPath?: string
  onComplete?: () => void
}

export function useGoogleAuth({ redirectPath = '/home', onComplete }: UseGoogleAuthOptions = {}) {
  const { setToken } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const googleAuth = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(true)
      setError('')

      try {
        const res = await api.post<{ access_token: string }>('/auth/google', {
          access_token: response.access_token,
          token_type: 'bearer'
        })

        if (res.data?.access_token) {
          setToken(res.data.access_token)

          if (onComplete) {
            onComplete()
          }

          navigate(redirectPath, { replace: true })
        } else {
          setError('Authentication failed. Please try again.')
        }
      } catch (err: unknown) {
        console.error('Error during Google authentication:', err)
        if (err && typeof err === 'object' && 'response' in err) {
          const errorObj = err as { response?: { data?: { detail?: string } }; message?: string }
          setError(errorObj.response?.data?.detail || errorObj.message || 'Authentication failed')
        } else {
          setError('An error occurred during authentication.')
        }
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      setError('Google sign-in was unsuccessful. Please try again.')
    }
  })

  return {
    googleLogin: () => googleAuth(),
    isLoading,
    error,
    clearError: () => setError('')
  }
}
