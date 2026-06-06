import type { ITableRow } from './infoTable.base'

export interface IChannelSource extends ITableRow {
  name: string
  createdAt: Date
  deleted: boolean
}

export type IChannelSourcePick<T extends keyof IChannelSource> = Pick<IChannelSource, T>
