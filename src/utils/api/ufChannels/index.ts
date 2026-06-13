import api from '..'
import type { Data, IEntity } from '../models/infoEntityV2.base'

class UfChannelsApi {
  async getTableEntity(channelId: number, id: number) {
    const data = await api.get<{ result: IEntity }>(
      `/v1/channels/${channelId}/uf-channels/table/${id}`
    )
    return data.data.result
  }

  async getCreateTable(channelId: number) {
    const data = await api.get(`/v1/channels/${channelId}/uf-channels/table/create`)
    return data.data.result
  }

  async createEntity(channelId: number, entity: Data) {
    const data = await api.post<{ result: { id: string } }>(
      `/v1/channels/${channelId}/uf-channels`,
      entity
    )
    return data.data.result
  }

  async saveEntity(channelId: number, entity: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>(
      `/v1/channels/${channelId}/uf-channels/${entity.id}`,
      entity
    )
    return data.data.result
  }
}

const ufChannelsApi = new UfChannelsApi()

export default ufChannelsApi
