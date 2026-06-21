import api from '@/src/utils/api'
import type { Data, IEntity } from '@/src/utils/api/models/infoEntityV2.base'
import type { ITableFilterValue, ITableList } from '@/src/utils/api/models/infoTableV2.base'
import type { IReportType } from '@/src/utils/api/models/reportType'

class ReportTypeApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IReportType>> {
    const data = await api.post<{ result: ITableList<IReportType> }>(
      '/v1/report-types/table/list',
      {
        page,
        size,
        filter,
      }
    )

    return data.data.result
  }

  async getTableEntity(id: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/report-types/table/${id}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`v1/report-types/table/create`)
    return data.data.result
  }

  async createEntity(entity: Data) {
    const data = await api.post<{ result: { id: string } }>(`/v1/report-types`, entity)
    return data.data.result
  }

  async saveEntity(entity: IEntity['data']) {
    const data = await api.patch<{ result: boolean }>(`/v1/report-types/${entity.id}`, entity)
    return data.data.result
  }
}

const reportTypeApi = new ReportTypeApi()

export default reportTypeApi
