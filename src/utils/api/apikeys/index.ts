import api from '..'
import type { IEntity } from '../models/infoEntity.base'
import type { ITableFilterValue } from '../models/infoTable.base'

class ApiKeysApi {
  async getTableList(page: number, size: number, filter: Record<string, ITableFilterValue>) {
    const data = await api.post('/v1/api-keys/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableById(apiKeyId: number) {
    const data = await api.get(`/v1/api-keys/table/${apiKeyId}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/api-keys/table/create`)
    return data.data.result
  }

  async createEntity(dto: object) {
    const data = await api.post<{ result: { id: string } }>('/v1/api-keys', dto)
    return data.data.result
  }

  async saveApiKey(data: IEntity['data']) {
    const response = await api.patch<{ result: boolean }>('/v1/api-keys', data)

    return response.data.result
  }
}

const apiKeysApi = new ApiKeysApi()

export default apiKeysApi
