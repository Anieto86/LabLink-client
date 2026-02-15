import { useFormTemplates } from '@/features/forms/api/formTemplates.api'
import type { FormTemplate } from './formTemplate.types'

export const useFormTemplateViewModel = () => {
  const { data, isLoading, error } = useFormTemplates()

  const formTemplates = data as FormTemplate[]

  return { formTemplates, isLoading, error }
}

