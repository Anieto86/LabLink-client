import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMeRequest, loginRequest } from '@/features/auth/api/auth.api'
import type { LoginRequest, UserMe } from '@/features/auth/model/auth.types'
import { setUnauthorizedHandler, type ApiError } from '@/shared/lib/apiClient'
import type { ReactNode } from 'react'

const TOKEN_KEY = 'lablink_token'
const DEMO_USER_KEY = 'lablink_demo_user'
const DEMO_TOKEN = 'lablink_demo_token'
const TEST_AUTH_BYPASS = String(import.meta.env.TEST_AUTH_BYPASS || '').toLowerCase() === 'true'
const TEST_ADMIN_EMAIL = import.meta.env.TEST_ADMIN_EMAIL || ''
const TEST_ADMIN_PASSWORD = import.meta.env.TEST_ADMIN_PASSWORD || ''

type AuthSessionContextType = {
  user: UserMe | null
  token: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (payload: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthSessionContext = createContext<AuthSessionContextType | null>(null)

const extractToken = (response: Awaited<ReturnType<typeof loginRequest>>) => {
  return response.access_token || response.token || response.accessToken || response.jwt || response.data?.access_token || response.data?.token || response.data?.accessToken || response.data?.jwt
}

export const AuthSessionProvider = ({ children }: { children: ReactNode }) => {
  // Infra Step 2: estado central de sesion (token + user) para toda la aplicacion.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<UserMe | null>(() => {
    const raw = localStorage.getItem(DEMO_USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as UserMe
    } catch {
      return null
    }
  })
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(DEMO_USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const bootstrapSession = useCallback(async () => {
    // Infra Step 2.1: rehidrata token desde storage y valida contra /user/me.
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (!currentToken) {
      setIsBootstrapping(false)
      return
    }

    if (currentToken === DEMO_TOKEN) {
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
    try {
      // Infra Step 2.2: login obtiene token, lo persiste y luego consulta perfil (/user/me).
      const response = await loginRequest(payload)
      const nextToken = extractToken(response)
      if (!nextToken) {
        throw { status: 0, code: 'UNKNOWN', message: 'Token not returned by login endpoint' } as ApiError
      }

      localStorage.setItem(TOKEN_KEY, nextToken)
      setToken(nextToken)

      const me = await getMeRequest()
      setUser(me)
      localStorage.removeItem(DEMO_USER_KEY)
    } catch (error) {
      const apiError = error as ApiError
      const canBypass =
        TEST_AUTH_BYPASS &&
        payload.email === TEST_ADMIN_EMAIL &&
        payload.password === TEST_ADMIN_PASSWORD &&
        (apiError.status === 0 || apiError.code === 'UNKNOWN')

      if (canBypass) {
        const demoUser: UserMe = {
          id: 'test-admin',
          email: TEST_ADMIN_EMAIL,
          name: 'Test Admin'
        }
        localStorage.setItem(TOKEN_KEY, DEMO_TOKEN)
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
        setToken(DEMO_TOKEN)
        setUser(demoUser)
        return
      }

      logout()
      throw apiError
    }
  }, [logout])

  useEffect(() => {
    void bootstrapSession()
    // Infra Step 5: conecta capa HTTP con capa sesion para cerrar sesion en 401.
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
