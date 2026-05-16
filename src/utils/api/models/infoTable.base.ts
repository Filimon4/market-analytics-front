export interface ITableColumn {
  code: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select'
  filtrable: boolean
  selectUrl?: string // for select
  constantList?: string[] // for constant
  path?: string
}

export interface ITableRow {
  id: string | number
  [key: string]: unknown
}

export interface ITableList<T extends ITableRow> {
  columns: ITableColumn[]
  data: T[]
  page: number
  total: number
  maxPage: number
}
