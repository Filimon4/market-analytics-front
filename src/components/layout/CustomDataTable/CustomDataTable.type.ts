export interface ColumnDefinition {
  code: string
  filtrable: boolean
  name: string,
  type: string
}

export interface RowData {
  [key: string]: unknown
}

export interface Props {
  columns:       ColumnDefinition[]
  data?:         RowData[]
  page?:         number
  pageSize?:     number
  total?:        number
  maxPage?:      number
}