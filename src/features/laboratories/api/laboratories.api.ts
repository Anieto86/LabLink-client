import apiClient from '@/shared/lib/apiClient'
import type { Laboratory, LaboratoryPayload } from '@/features/laboratories/model/laboratory.types'

export const listLaboratories = async () => {
  const { data } = await apiClient.get<Laboratory[]>('/laboratories')
  return data
}

export const createLaboratory = async (payload: LaboratoryPayload) => {
  const { data } = await apiClient.post<Laboratory>('/laboratories', payload)
  return data
}

export const updateLaboratory = async (id: string, payload: LaboratoryPayload) => {
  const { data } = await apiClient.patch<Laboratory>(`/laboratories/${id}`, payload)
  return data
}

export const deleteLaboratory = async (id: string) => {
  await apiClient.delete(`/laboratories/${id}`)
}

