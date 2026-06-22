import api from '..'
import type { IChannelSource } from '../models/channelSource'
import type { IEntity } from '@/src/utils/api/models/infoEntityV2.base'
import type { ITableFilterValue, ITableList } from '../models/infoTable.base'

class ChannelSourceApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IChannelSource>> {
    const data = await api.post<{ result: ITableList<IChannelSource> }>(
      '/v1/channel-sources/table/list',
      {
        page,
        size,
        filter,
      }
    )

    return data.data.result
  }

  async getTableEntity(id: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/channel-sources/table/${id}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/channel-sources/table/create`)
    return data.data.result
  }

  async saveChannelSource(entity: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>('/v1/channel-sources', entity)
    return data.data.result
  }

  async createEntity(entity: IEntity['data']) {
    const data = await api.post<{ result: { id: string } }>('/v1/channel-sources', entity)
    return data.data.result
  }

  async deleteEntity(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/channel-sources/${id}`)
    return data.data.result
  }

  async restoreEntity(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/channel-sources/${id}/restore`)
    return data.data.result
  }
}

const channelSrouceApi = new ChannelSourceApi()

export default channelSrouceApi
