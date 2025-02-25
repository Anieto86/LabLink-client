import { useFormTemplates } from '@/api/formTemplates'

interface Structure {
  name: string
  type: string
}

interface FormTemplate {
  id: string
  created_at: string
  name: string
  description: string
  structure: Structure[]
}

const FormTemplates = () => {
  const { data, isLoading, error } = useFormTemplates()
  const formTemplates = data as FormTemplate[]

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading forms</p>

  console.log(formTemplates)

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

export default FormTemplates
