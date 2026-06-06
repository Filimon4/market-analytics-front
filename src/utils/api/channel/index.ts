import api from '..'
import type { IChannel } from '../models/channel'
import type { IEntity } from '../models/infoEntity.base'
import type { ITableFilterValue, ITableList } from '../models/infoTable.base'

class ChannelApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IChannel>> {
    const data = await api.post<{ result: ITableList<IChannel> }>('/v1/channels/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableEntity(id: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/channels/table/${id}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/channels/table/create`)
    return data.data.result
  }

  async saveEntity(entity: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>('/v1/channels', entity)
    return data.data.result
  }

  async createEntity(entity: IEntity['data']) {
    const data = await api.post<{ result: { id: string } }>('/v1/channels', entity)
    return data.data.result
  }

  async deleteEntity(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/channels/${id}`)
    return data.data.result
  }

  async restoreEntity(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/channels/${id}/restore`)
    return data.data.result
  }
}

const channelApi = new ChannelApi()

export default channelApi
