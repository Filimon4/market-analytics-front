export interface Block {
  name: string
  code: string
  columnCapacity: number
  maxColumns: number
}

export interface Field {
  title: string
  path: string
  editable: boolean
  type: string
  editPath?: string
}

export interface BlockDetail {
  fields: Field[]
  blockCode: string
}

export interface Action {
  title: string
  code: string
  size: 'small' | 'medium' | 'large'
  blockCode: string
}

export interface Row {
  blockCode: string
  [key: string]: unknown
}
