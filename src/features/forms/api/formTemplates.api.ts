import api from '@/shared/lib/apiClient'
import { useQuery } from '@tanstack/react-query'

const getFormTemplates = async () => {
  const { data } = await api.get('/form-templates')
  return data
}

export const useFormTemplates = () => {
  return useQuery({
    queryKey: ['formTemplates'],
    queryFn: getFormTemplates
  })
}

