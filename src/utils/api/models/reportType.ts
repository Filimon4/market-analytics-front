import type { ITableRow } from './infoTable.base'

export interface IReportType extends ITableRow {
  name: string
  code: string
  description: string
  createdAt: string
}

export type IReportTypePick<T extends keyof IReportType> = Pick<IReportType, T>
