import axios, {
  type AxiosAdapter,
  type AxiosError as AxiosErrorType,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

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
const MOCK_STORAGE_KEY = 'lablink_mock_state'
const TEST_MOCK_API = String(import.meta.env.TEST_MOCK_API || 'true').toLowerCase() === 'true'
const TEST_ADMIN_EMAIL = import.meta.env.TEST_ADMIN_EMAIL || 'admin@lablink.test'
const TEST_ADMIN_PASSWORD = import.meta.env.TEST_ADMIN_PASSWORD || 'Admin12345!'

type MockUser = {
  id: string
  email: string
  name?: string
  password: string
}

type MockLaboratory = {
  id: string
  name: string
  description?: string
  location?: string
}

type MockResource = {
  id: string
  name: string
  type?: string
  laboratoryId?: string
}

type MockReservation = {
  id: string
  userId: string
  laboratoryId?: string
  resourceId?: string
  reservationDate: string
  startTime: string
  endTime: string
  status?: string
}

type MockState = {
  users: MockUser[]
  tokens: Record<string, string>
  laboratories: MockLaboratory[]
  resources: MockResource[]
  reservations: MockReservation[]
}

const initialMockState = (): MockState => ({
  users: [
    {
      id: 'user-admin',
      email: TEST_ADMIN_EMAIL,
      name: 'Test Admin',
      password: TEST_ADMIN_PASSWORD
    }
  ],
  tokens: {},
  laboratories: [],
  resources: [],
  reservations: []
})

const loadMockState = (): MockState => {
  const raw = localStorage.getItem(MOCK_STORAGE_KEY)
  if (!raw) return initialMockState()
  try {
    const parsed = JSON.parse(raw) as MockState
    return {
      ...initialMockState(),
      ...parsed
    }
  } catch {
    return initialMockState()
  }
}

const mockState = loadMockState()

const saveMockState = () => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockState))
}

const normalizePath = (url = '') => {
  const withoutQuery = url.split('?')[0]
  if (withoutQuery.startsWith('http://') || withoutQuery.startsWith('https://')) {
    return new URL(withoutQuery).pathname
  }
  return withoutQuery
}

const readBody = (config: InternalAxiosRequestConfig): Record<string, unknown> => {
  const body = config.data
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>
    } catch {
      const params = new URLSearchParams(body)
      const output: Record<string, unknown> = {}
      params.forEach((value, key) => {
        output[key] = value
      })
      return output
    }
  }
  if (body instanceof URLSearchParams) {
    const output: Record<string, unknown> = {}
    body.forEach((value, key) => {
      output[key] = value
    })
    return output
  }
  if (typeof body === 'object') {
    return body as Record<string, unknown>
  }
  return {}
}

const response = (config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse => ({
  status,
  statusText: String(status),
  data,
  headers: {},
  config
})

const fail = (config: InternalAxiosRequestConfig, status: number, message: string, details?: unknown): never => {
  throw new axios.AxiosError(message, undefined, config, undefined, response(config, status, details || { message }))
}

const getBearerToken = (config: InternalAxiosRequestConfig) => {
  const headers = config.headers as Record<string, unknown> | undefined
  const authHeader = (headers?.Authorization || headers?.authorization) as string | undefined
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7).trim()
}

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
const isValidTime = (value: string) => /^\d{2}:\d{2}:\d{2}$/.test(value)
const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => aStart < bEnd && aEnd > bStart

const requireUser = (config: InternalAxiosRequestConfig): MockUser => {
  const token = getBearerToken(config)
  if (!token) fail(config, 401, 'Missing bearer token')
  const userId = mockState.tokens[token]
  if (!userId) fail(config, 401, 'Invalid session')
  const user = mockState.users.find((item) => item.id === userId)
  if (!user) fail(config, 401, 'Invalid session')
  return user
}

const nextId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const mockAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || 'get').toLowerCase()
  const path = normalizePath(config.url)
  const body = readBody(config)

  if (method === 'post' && path === '/auth/login') {
    const email = String(body.email || body.username || '')
    const password = String(body.password || '')
    const user = mockState.users.find((item) => item.email === email && item.password === password)
    if (!user) fail(config, 401, 'Invalid credentials')

    const token = `mock-token-${user.id}`
    mockState.tokens[token] = user.id
    saveMockState()
    return response(config, 200, { access_token: token })
  }

  if (method === 'post' && path === '/user') {
    const email = String(body.email || '')
    const password = String(body.password || '')
    const name = String(body.name || '')
    if (!email || !password) fail(config, 422, 'email and password are required')
    if (mockState.users.some((item) => item.email === email)) fail(config, 409, 'User already exists')
    const user: MockUser = {
      id: nextId('user'),
      email,
      name: name || email,
      password
    }
    mockState.users.push(user)
    saveMockState()
    return response(config, 201, { id: user.id, email: user.email, name: user.name })
  }

  const currentUser = requireUser(config)

  if (method === 'get' && path === '/user/me') {
    return response(config, 200, { id: currentUser.id, email: currentUser.email, name: currentUser.name })
  }

  if (path === '/laboratories' && method === 'get') {
    return response(config, 200, mockState.laboratories)
  }
  if (path === '/laboratories' && method === 'post') {
    const name = String(body.name || '')
    if (!name) fail(config, 422, 'name is required')
    const item: MockLaboratory = {
      id: nextId('lab'),
      name,
      description: body.description ? String(body.description) : undefined,
      location: body.location ? String(body.location) : undefined
    }
    mockState.laboratories.push(item)
    saveMockState()
    return response(config, 201, item)
  }
  if (path.startsWith('/laboratories/')) {
    const id = path.replace('/laboratories/', '')
    const item = mockState.laboratories.find((entry) => entry.id === id)
    if (!item) fail(config, 404, 'Laboratory not found')
    if (method === 'get') return response(config, 200, item)
    if (method === 'patch') {
      item.name = String(body.name || item.name)
      item.description = body.description ? String(body.description) : item.description
      item.location = body.location ? String(body.location) : item.location
      saveMockState()
      return response(config, 200, item)
    }
    if (method === 'delete') {
      mockState.laboratories = mockState.laboratories.filter((entry) => entry.id !== id)
      saveMockState()
      return response(config, 204, null)
    }
  }

  if (path === '/resources' && method === 'get') {
    return response(config, 200, mockState.resources)
  }
  if (path === '/resources' && method === 'post') {
    const name = String(body.name || '')
    if (!name) fail(config, 422, 'name is required')
    const item: MockResource = {
      id: nextId('resource'),
      name,
      type: body.type ? String(body.type) : undefined,
      laboratoryId: body.laboratoryId ? String(body.laboratoryId) : undefined
    }
    mockState.resources.push(item)
    saveMockState()
    return response(config, 201, item)
  }
  if (path.startsWith('/resources/')) {
    const id = path.replace('/resources/', '')
    const item = mockState.resources.find((entry) => entry.id === id)
    if (!item) fail(config, 404, 'Resource not found')
    if (method === 'get') return response(config, 200, item)
    if (method === 'patch') {
      item.name = String(body.name || item.name)
      item.type = body.type ? String(body.type) : item.type
      item.laboratoryId = body.laboratoryId ? String(body.laboratoryId) : item.laboratoryId
      saveMockState()
      return response(config, 200, item)
    }
    if (method === 'delete') {
      mockState.resources = mockState.resources.filter((entry) => entry.id !== id)
      saveMockState()
      return response(config, 204, null)
    }
  }

  if (path === '/reservations' && method === 'get') {
    return response(config, 200, mockState.reservations)
  }
  if (path.startsWith('/reservations/user/') && method === 'get') {
    const userId = path.replace('/reservations/user/', '')
    return response(
      config,
      200,
      mockState.reservations.filter((item) => item.userId === userId)
    )
  }
  if (path === '/reservations' && method === 'post') {
    const reservationDate = String(body.reservationDate || '')
    const startTime = String(body.startTime || '')
    const endTime = String(body.endTime || '')
    const userId = String(body.userId || '')
    const laboratoryId = body.laboratoryId ? String(body.laboratoryId) : undefined
    const resourceId = body.resourceId ? String(body.resourceId) : undefined

    if (!userId || !reservationDate || !startTime || !endTime) fail(config, 422, 'Missing required reservation fields')
    if (!isValidDate(reservationDate)) fail(config, 422, 'reservationDate must be YYYY-MM-DD')
    if (!isValidTime(startTime) || !isValidTime(endTime)) fail(config, 422, 'startTime/endTime must be HH:mm:ss')
    if (endTime <= startTime) fail(config, 422, 'endTime must be greater than startTime')

    const conflict = mockState.reservations.find((item) => {
      if (item.reservationDate !== reservationDate) return false
      const sameResource = resourceId && item.resourceId && item.resourceId === resourceId
      const sameLab = laboratoryId && item.laboratoryId && item.laboratoryId === laboratoryId
      if (!sameResource && !sameLab) return false
      return overlaps(startTime, endTime, item.startTime, item.endTime)
    })
    if (conflict) fail(config, 409, 'Reservation overlap')

    const item: MockReservation = {
      id: nextId('reservation'),
      userId,
      laboratoryId,
      resourceId,
      reservationDate,
      startTime,
      endTime,
      status: 'active'
    }
    mockState.reservations.push(item)
    saveMockState()
    return response(config, 201, item)
  }

  if (path.startsWith('/reservations/') && !path.startsWith('/reservations/user/')) {
    const id = path.replace('/reservations/', '')
    const item = mockState.reservations.find((entry) => entry.id === id)
    if (!item) fail(config, 404, 'Reservation not found')

    if (method === 'get') return response(config, 200, item)
    if (method === 'patch') {
      const reservationDate = String(body.reservationDate || item.reservationDate)
      const startTime = String(body.startTime || item.startTime)
      const endTime = String(body.endTime || item.endTime)
      const userId = String(body.userId || item.userId)
      const laboratoryId = body.laboratoryId ? String(body.laboratoryId) : item.laboratoryId
      const resourceId = body.resourceId ? String(body.resourceId) : item.resourceId

      if (!isValidDate(reservationDate)) fail(config, 422, 'reservationDate must be YYYY-MM-DD')
      if (!isValidTime(startTime) || !isValidTime(endTime)) fail(config, 422, 'startTime/endTime must be HH:mm:ss')
      if (endTime <= startTime) fail(config, 422, 'endTime must be greater than startTime')

      const conflict = mockState.reservations.find((entry) => {
        if (entry.id === id || entry.reservationDate !== reservationDate) return false
        const sameResource = resourceId && entry.resourceId && entry.resourceId === resourceId
        const sameLab = laboratoryId && entry.laboratoryId && entry.laboratoryId === laboratoryId
        if (!sameResource && !sameLab) return false
        return overlaps(startTime, endTime, entry.startTime, entry.endTime)
      })
      if (conflict) fail(config, 409, 'Reservation overlap')

      item.userId = userId
      item.laboratoryId = laboratoryId
      item.resourceId = resourceId
      item.reservationDate = reservationDate
      item.startTime = startTime
      item.endTime = endTime
      saveMockState()
      return response(config, 200, item)
    }
    if (method === 'delete') {
      mockState.reservations = mockState.reservations.filter((entry) => entry.id !== id)
      saveMockState()
      return response(config, 204, null)
    }
  }

  fail(config, 404, `Mock route not found: ${method.toUpperCase()} ${path}`)
}

const apiClient = axios.create({
  baseURL: API_URL,
  adapter: TEST_MOCK_API ? mockAdapter : undefined,
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
  (error: AxiosErrorType) => {
    const normalizedError = normalizeApiError(error)
    if (normalizedError.code === 'UNAUTHORIZED' && unauthorizedHandler) {
      unauthorizedHandler()
    }
    return Promise.reject(normalizedError)
  }
)

export default apiClient

