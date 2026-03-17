import { beforeEach, describe, expect, it } from 'vitest'
import apiClient from '@/shared/lib/apiClient'

describe('apiClient mock adapter', () => {
  beforeEach(() => {
    localStorage.removeItem('lablink_token')
  })

  it('authenticates with mock credentials and resolves /user/me', async () => {
    const loginResponse = await apiClient.post('/auth/login', {
      email: 'admin@lablink.test',
      password: 'Admin12345!'
    })

    expect(loginResponse.data.access_token).toContain('mock-token-')

    localStorage.setItem('lablink_token', loginResponse.data.access_token)

    const meResponse = await apiClient.get('/user/me')

    expect(meResponse.data).toMatchObject({
      id: 'user-admin',
      email: 'admin@lablink.test'
    })
  })
})
