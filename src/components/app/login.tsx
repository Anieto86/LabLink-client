import React, { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post<{ access_token: string }>('/auth/login', { email, password })
      setToken(response.data.access_token)
    } catch (error) {
      console.error('Error to star session', error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Iniciar sesión</button>
    </form>
  )
}

export default Login
