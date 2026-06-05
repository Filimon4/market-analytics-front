import api from '..'
import type { IEntity } from '../models/infoEntity.base'
import type { ITableList } from '../models/infoTable.base'
import type { IRole } from '../models/role'

class RoleApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, string | number>
  ): Promise<ITableList<IRole>> {
    const data = await api.post<{ result: ITableList<IRole> }>('/v1/project/roles/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableById(roleId: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/project/roles/table/${roleId}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/project/roles/table/create`)
    return data.data.result
  }

  async createEntity(dto: object) {
    const data = await api.post<{ result: { id: string; code: string } }>('/v1/project/roles', dto)
    return data.data.result
  }

  async deleteRole(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/project/roles/${id}`)
    return data.data.result
  }

  async restoreRole(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/project/roles/restore/${id}`)
    return data.data.result
  }

  async saveRole(data: IEntity['data']) {
    const response = await api.patch<{ result: boolean }>('/v1/project/roles', data)

    return response.data.result
  }
}

const roleApi = new RoleApi()

export default roleApi
