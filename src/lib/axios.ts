import { useAuthStore } from '@/store/auth'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add the token to each request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  // console.log(token, 'token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
