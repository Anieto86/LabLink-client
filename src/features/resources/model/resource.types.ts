export interface Resource {
  id: string
  name: string
  type?: string
  laboratoryId?: string
}

export interface ResourcePayload {
  name: string
  type?: string
  laboratoryId?: string
}

