import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMeRequest, loginRequest } from '@/features/auth/api/auth.api'
import type { LoginRequest, UserMe } from '@/features/auth/model/auth.types'
import { setUnauthorizedHandler, type ApiError } from '@/shared/lib/apiClient'
import type { ReactNode } from 'react'

const TOKEN_KEY = 'lablink_token'

type AuthSessionContextType = {
  user: UserMe | null
  token: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (payload: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthSessionContext = createContext<AuthSessionContextType | null>(null)

export const AuthSessionProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<UserMe | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const bootstrapSession = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (!currentToken) {
      setIsBootstrapping(false)
      return
    }

    try {
      const me = await getMeRequest()
      setToken(currentToken)
      setUser(me)
    } catch {
      logout()
    } finally {
      setIsBootstrapping(false)
    }
  }, [logout])

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await loginRequest(payload)
    const nextToken = response.access_token || response.token
    if (!nextToken) {
      throw { status: 0, code: 'UNKNOWN', message: 'Token not returned by login endpoint' } as ApiError
    }

    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)

    try {
      const me = await getMeRequest()
      setUser(me)
    } catch {
      logout()
      throw { status: 0, code: 'UNAUTHORIZED', message: 'Session bootstrap failed after login' } as ApiError
    }
  }, [logout])

  useEffect(() => {
    void bootstrapSession()
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [bootstrapSession, logout])

  const value = useMemo<AuthSessionContextType>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      logout
    }),
    [user, token, isBootstrapping]
  )

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext)
  if (!context) {
    throw new Error('useAuthSession must be used inside AuthSessionProvider')
  }
  return context
}
