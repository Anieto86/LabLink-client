export interface StructureType {
  name: string
  type: string
}

export interface FormTemplateType {
  id: string
  created_at: string
  name: string
  description: string
  structure: StructureType[]
}

export interface FormFieldType {
  label: string
  type: 'text' | 'number' | 'date'
}

export interface FormDataType {
  fields: FormFieldType[]
}
