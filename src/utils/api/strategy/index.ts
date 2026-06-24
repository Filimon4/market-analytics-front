import type { IEntity } from '@/src/utils/api/models/infoEntityV2.base'
import api from '..'
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

  async select() {
    const data = await api.get<{ result: { id: number; code: string }[] }>('/v1/strategies/select')
    return data.data.result
  }

  async statistics(
    id: number,
    options?: {
      from?: Date
      to?: Date
    }
  ) {
    const data = await api.get<{
      result: {
        strategy: {
          id: string
          name: string
          deleted: boolean
        }
        channels: {
          total: number
          active: number
          deleted: number
        }
        performanceRecords: {
          total: number
          active: number
          deleted: number
          period: {
            startDate: string
            endDate: string
          }
        }
        fields: {
          metricChannels: {
            total: number
            active: number
          }
          ufChannels: {
            total: number
            active: number
          }
        }
        totals: {
          spend: number
          impressions: number
          clicks: number
          leads: number
        }
      }
    }>(`/v1/strategies/${id}/statistics`, {
      params: {
        ...options,
      },
    })
    return data.data.result
  }
}

const strategyApi = new StrategyApi()

export default strategyApi
