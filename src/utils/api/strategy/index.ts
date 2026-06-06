import api from '..'
import type { IEntity } from '../models/infoEntity.base'
import type { ITableFilterValue, ITableList } from '../models/infoTable.base'
import type { IStrategy } from '../models/strategy'

class StrategyApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IStrategy>> {
    const data = await api.post<{ result: ITableList<IStrategy> }>('/v1/strategies/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableEntity(id: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/strategies/table/${id}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/strategies/table/create`)
    return data.data.result
  }

  async updateStrategy(dto: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>(`/v1/strategies/${dto.id}`, dto)
    return data.data.result
  }

  async createStrategy(dto: IEntity['data']) {
    const data = await api.post<{ result: { id: string } }>(`/v1/strategies`, dto)
    return data.data.result
  }

  async deleteStrategy(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/strategies/${id}`)
    return data.data.result
  }

  async restoreStrategy(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/strategies/${id}/restore`)
    return data.data.result
  }
}

const strategyApi = new StrategyApi()

export default strategyApi
