import { useFormTemplates } from '@/api/formTemplates'
import type { FormTemplate } from '@/components/app/features/FormTemplates/formTempaltesTypes'

export const FormTemplateViewModel = () => {
  const { data, isLoading, error } = useFormTemplates()

  const formTemplates = data as FormTemplate[]

  return { formTemplates, isLoading, error }
}
