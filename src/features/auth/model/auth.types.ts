export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token?: string
  token?: string
  accessToken?: string
  jwt?: string
  data?: {
    token?: string
    access_token?: string
    accessToken?: string
    jwt?: string
  }
}

export interface UserMe {
  id: string
  email: string
  name?: string
}

export type UserMeResponse =
  | UserMe
  | {
      user?: UserMe
      data?: UserMe
    }
