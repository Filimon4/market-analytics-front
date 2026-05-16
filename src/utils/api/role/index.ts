import api from '..'
import type { IEntity } from '../models/infoEntiyt.base'
import type { ITableList } from '../models/infoTable.base'
import type { IRole } from '../models/role'

class RoleApi {
  async getTableList(page: number, size: number, filter: Record<string, string | number>) {
    const data = await api.post<{ result: ITableList<IRole> }>('/v1/project/role/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableById(roleId: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/project/role/table/${roleId}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/project/role/table/create`)
    return data.data.result
  }

  async createEntity(dto: object) {
    const data = await api.post<{ result: { id: string; code: string } }>('/v1/project/role', dto)
    return data.data.result
  }

  async deleteRole(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/project/role/${id}`)
    return data.data.result
  }

  async restoreRole(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/project/role/restore/${id}`)
    return data.data.result
  }

  async saveRole(data: IEntity['data']) {
    const response = await api.patch<{ result: boolean }>('/v1/project/role', data)

    return response.data.result
  }
}

const roleApi = new RoleApi()

export default roleApi
