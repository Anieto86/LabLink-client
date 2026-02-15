import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLaboratory, deleteLaboratory, listLaboratories, updateLaboratory } from '@/features/laboratories/api/laboratories.api'
import type { LaboratoryPayload } from '@/features/laboratories/model/laboratory.types'

const LABORATORIES_QUERY_KEY = ['laboratories']

export const useLaboratories = () => {
  return useQuery({
    queryKey: LABORATORIES_QUERY_KEY,
    queryFn: listLaboratories
  })
}

export const useCreateLaboratory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LaboratoryPayload) => createLaboratory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LABORATORIES_QUERY_KEY })
  })
}

export const useUpdateLaboratory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LaboratoryPayload }) => updateLaboratory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LABORATORIES_QUERY_KEY })
  })
}

export const useDeleteLaboratory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteLaboratory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LABORATORIES_QUERY_KEY })
  })
}

