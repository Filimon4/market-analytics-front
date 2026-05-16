import type { ITableRow } from './infoTable.base'

export interface IRole extends ITableRow {
  code: string
  projectId: string
  default: boolean
}
