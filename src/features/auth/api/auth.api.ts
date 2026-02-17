import apiClient from '@/shared/lib/apiClient'
import type { LoginRequest, LoginResponse, UserMe, UserMeResponse } from '@/features/auth/model/auth.types'
import type { ApiError } from '@/shared/lib/apiClient'

export const loginRequest = async (payload: LoginRequest) => {
  try {
    // Infra Contract: endpoint de inicio de sesion.
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
    return data
  } catch (error) {
    const apiError = error as ApiError
    // Some backends expect urlencoded + username/password instead of JSON + email/password.
    if (apiError.code === 'VALIDATION_ERROR' || apiError.status === 404 || apiError.status === 415) {
      const formData = new URLSearchParams()
      formData.append('username', payload.email)
      formData.append('password', payload.password)
      const { data } = await apiClient.post<LoginResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return data
    }
    throw error
  }
}

export const getMeRequest = async () => {
  // Infra Contract: endpoint para validar token y recuperar identidad actual.
  const { data } = await apiClient.get<UserMeResponse>('/user/me')
  if ('id' in data && 'email' in data) {
    return data as UserMe
  }
  if ('user' in data && data.user) {
    return data.user
  }
  if ('data' in data && data.data) {
    return data.data
  }
  throw { status: 0, code: 'UNKNOWN', message: 'Invalid /user/me response shape' } as ApiError
}
