export interface ITableColumn {
  code: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'constants'
  filtrable: boolean
  selectUrl?: string // for select
  constantList?: string[] // for constant
  path?: string
  /**
   * Фильтрафия
   *
   * Вид фильтра datetime типа
   */
  dateTimeFilterType?: 'period' | 'exact'
}

export interface IDateTimePeriodFilter {
  from?: string
  to?: string
}

export type ITableFilterValue = string | number | IDateTimePeriodFilter

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

export interface IMetricsTableList<T extends ITableRow> {
  data: T[]
  page: number
  total: number
  maxPage: number
}
