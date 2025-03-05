import type { FormTemplate } from './FormTemplateTypes'
import { FormTemplateViewModel } from './FormTemplateViewModel'

export const FormTemplates = () => {
  const { formTemplates, isLoading, error } = FormTemplateViewModel()

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
