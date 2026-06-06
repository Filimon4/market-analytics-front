import type { ITableRow } from './infoTable.base'

export interface IStrategy extends ITableRow {
  name: string
  descriptino: string
  createdAt: Date
  deleted: boolean
}

export type IStrategyPick<T extends keyof IStrategy> = Pick<IStrategy, T>
