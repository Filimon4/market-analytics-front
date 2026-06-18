import api from '..'
import type { IEntity } from '../models/infoEntityV2.base'

class ChannelPerformancePropertyApi {
  async getTableEntity(channelPerformanceId: number, id: number) {
    const data = await api.get<{ result: IEntity }>(
      `/v1/channel-performances/${channelPerformanceId}/properites/table/${id}`
    )
    return data.data.result
  }

  async saveEntity(channelPerformanceId: number, entity: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>(
      `/v1/channel-performances/${channelPerformanceId}/properites/${entity.id}`,
      entity
    )
    return data.data.result
  }
}

const channelPerformancePropertyApi = new ChannelPerformancePropertyApi()

export default channelPerformancePropertyApi
