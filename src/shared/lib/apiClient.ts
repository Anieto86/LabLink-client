import axios, { type AxiosError } from 'axios'

export type ApiErrorCode = 'UNAUTHORIZED' | 'CONFLICT' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNKNOWN'

export interface ApiError {
  status: number
  code: ApiErrorCode
  message: string
  details?: unknown
}

let unauthorizedHandler: (() => void) | null = null

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler
}

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const data = error.response?.data as { message?: string; detail?: string } | undefined
    const message = data?.message || data?.detail || error.message || 'Request failed'

    if (status === 401) return { status, code: 'UNAUTHORIZED', message, details: data }
    if (status === 404) return { status, code: 'NOT_FOUND', message, details: data }
    if (status === 409) return { status, code: 'CONFLICT', message, details: data }
    if (status === 400 || status === 422) return { status, code: 'VALIDATION_ERROR', message, details: data }

    return { status, code: 'UNKNOWN', message, details: data }
  }

  return { status: 0, code: 'UNKNOWN', message: 'Unexpected error' }
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const AUTH_TOKEN_KEY = 'lablink_token'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalizedError = normalizeApiError(error)
    if (normalizedError.code === 'UNAUTHORIZED' && unauthorizedHandler) {
      unauthorizedHandler()
    }
    return Promise.reject(normalizedError)
  }
)

export default apiClient

