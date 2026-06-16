import api from '..'
import type { IChannelPerformance } from '../models/channelPerformance'
import type { IEntity } from '../models/infoEntityV2.base'
import type { ITableFilterValue, ITableList } from '../models/infoTableV2.base'

class ChannelPerformanceApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IChannelPerformance>> {
    const data = await api.post<{ result: ITableList<IChannelPerformance> }>(
      '/v1/channel-performances/table/list',
      {
        page,
        size,
        filter,
      }
    )

    return data.data.result
  }

  async getTableEntity(id: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/channel-performances/table/${id}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/channel-performances/table/create`)
    return data.data.result
  }

  async saveEntity(entity: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>(
      `/v1/channel-performances/${entity.id}`,
      entity
    )
    return data.data.result
  }

  async createEntity(entity: IEntity['data']) {
    const data = await api.post<{ result: { id: string } }>('/v1/channel-performances', entity)
    return data.data.result
  }

  async deleteEntity(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/channel-performances/${id}`)
    return data.data.result
  }

  async restoreEntity(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/channel-performances/${id}/restore`)
    return data.data.result
  }
}

const channelPerformanceApi = new ChannelPerformanceApi()

export default channelPerformanceApi
