import type { ITableRow } from './infoTable.base'

export interface IChannelPerformance extends ITableRow {
  startDate: Date
  endDate: Date
  impressions: number
  clicks: number
  spend: number
  conversions: number
  createdAt: Date
  updatedAt: Date
  deleted: boolean
}

export type IChannelPick<T extends keyof IChannelPerformance> = Pick<IChannelPerformance, T>
