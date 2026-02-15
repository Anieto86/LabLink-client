import { useFormTemplateViewModel } from '@/features/forms/model/useFormTemplateViewModel'
import type { FormTemplate } from '@/features/forms/model/formTemplate.types'

export const FormTemplates = () => {
  const { formTemplates, isLoading, error } = useFormTemplateViewModel()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading forms</p>

  return (
    <div>
      <h1>Form Templates</h1>
      <ul>
        {formTemplates.map((form: FormTemplate) => (
          <li key={form.id}>
            <p>{form.created_at}</p>
            <p>{form.name}</p>
            <p>{form.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
