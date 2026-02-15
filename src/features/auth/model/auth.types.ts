export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token?: string
  token?: string
}

export interface UserMe {
  id: string
  email: string
  name?: string
}

