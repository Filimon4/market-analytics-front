export interface ColumnDefinition {
  code: string
  filtrable: boolean
  name: string
  type: string
}

export interface RowData {
  [key: string]: unknown
}

export interface Action {
  title: string
  code: string
  size: 'small' | 'medium' | 'large'
}

export interface Props {
  columns: ColumnDefinition[]
  data?: RowData[]
  page?: number
  pageSize?: number
  total?: number
  maxPage?: number
  actions?: Action[]
}
