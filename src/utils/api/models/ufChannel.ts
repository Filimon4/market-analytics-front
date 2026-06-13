import type { ITableRow } from './infoTable.base'

export interface IUfChannels extends ITableRow {
  type: string
  value: string
  name: string
  code: string
  required: boolean
  deleted: boolean
}

export type IUfChannelsPick<T extends keyof IUfChannels> = Pick<IUfChannels, T>
