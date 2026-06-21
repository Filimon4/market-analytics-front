import type { ITableRow } from './infoTable.base'

export interface IReport extends ITableRow {
  name: string
  slug: string
  dateFrom: string
  dateTo: string
  visibility: string
  createdAt: string
  deleted: boolean
}

export type IReportPick<T extends keyof IReport> = Pick<IReport, T>
