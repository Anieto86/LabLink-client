import apiClient from '@/shared/lib/apiClient'
import type { Resource, ResourcePayload } from '@/features/resources/model/resource.types'

export const listResources = async () => {
  const { data } = await apiClient.get<Resource[]>('/resources')
  return data
}

export const createResource = async (payload: ResourcePayload) => {
  const { data } = await apiClient.post<Resource>('/resources', payload)
  return data
}

export const updateResource = async (id: string, payload: ResourcePayload) => {
  const { data } = await apiClient.patch<Resource>(`/resources/${id}`, payload)
  return data
}

export const deleteResource = async (id: string) => {
  await apiClient.delete(`/resources/${id}`)
}

