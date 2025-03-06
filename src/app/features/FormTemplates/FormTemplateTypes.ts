export interface Structure {
  name: string
  type: string
}

export interface FormTemplate {
  id: string
  created_at: string
  name: string
  description: string
  structure: Structure[]
}

export interface FormField {
  label: string
  type: 'text' | 'number' | 'date'
}

export interface FormData {
  fields: FormField[]
}
