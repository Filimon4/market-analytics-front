export interface ITableColumn {
  code: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'constants'
  filtrable: boolean
  selectUrl?: string // for select
  constantList?: string[] // for constant
  path?: string
}

export interface DataRow {
  id: string | number
  [key: string]: unknown
}

export interface Action {
  title: string
  code: string
  size: 'small' | 'medium' | 'large'
}

export interface ITableList<T extends DataRow[]> {
  columns: ITableColumn[]
  data: T
  page: number
  total: number
  maxPage: number
  actions?: Action[]
}
