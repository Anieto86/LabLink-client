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
