import type { ITableRow } from './infoTable.base'

export interface IChannel extends ITableRow {
  name: string
  channelSource: { id: number; code: string }
  strategy: { id: number; code: string }
  deleted: boolean
  createdAt: Date
}

export type IChannelPick<T extends keyof IChannel> = Pick<IChannel, T>
