import apiClient from '@/shared/lib/apiClient'
import type { LoginRequest, LoginResponse, UserMe } from '@/features/auth/model/auth.types'

export const loginRequest = async (payload: LoginRequest) => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
  return data
}

export const getMeRequest = async () => {
  const { data } = await apiClient.get<UserMe>('/user/me')
  return data
}

