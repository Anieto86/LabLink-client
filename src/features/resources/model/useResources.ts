import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createResource, deleteResource, listResources, updateResource } from '@/features/resources/api/resources.api'
import type { ResourcePayload } from '@/features/resources/model/resource.types'

const RESOURCES_QUERY_KEY = ['resources']

export const useResources = () => {
  return useQuery({
    queryKey: RESOURCES_QUERY_KEY,
    queryFn: listResources
  })
}

export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ResourcePayload) => createResource(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY })
  })
}

export const useUpdateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResourcePayload }) => updateResource(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY })
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY })
  })
}

