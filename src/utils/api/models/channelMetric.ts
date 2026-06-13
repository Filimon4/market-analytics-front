import type { ITableRow } from './infoTable.base'

export interface IChannelMetric extends ITableRow {
  name: string
  formula: string
  code: string
  deleted: boolean
}

export type IChannelMetricPick<T extends keyof IChannelMetric> = Pick<IChannelMetric, T>
