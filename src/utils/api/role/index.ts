import type { IEntity } from '@/src/utils/api/models/infoEntityV2.base'
import api from '..'
import type { ITableFilterValue, ITableList } from '../models/infoTable.base'
import type { IRole } from '../models/role'

class RoleApi {
  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IRole>> {
    const data = await api.post<{ result: ITableList<IRole> }>('/v1/roles/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableById(roleId: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/roles/table/${roleId}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/roles/table/create`)
    return data.data.result
  }

  async createEntity(dto: object) {
    const data = await api.post<{ result: { id: string; code: string } }>('/v1/roles', dto)
    return data.data.result
  }

  async deleteRole(id: number) {
    const data = await api.delete<{ result: boolean }>(`/v1/roles/${id}`)
    return data.data.result
  }

  async restoreRole(id: number) {
    const data = await api.patch<{ result: boolean }>(`/v1/roles/${id}/restore`)
    return data.data.result
  }

  async saveRole(data: IEntity['data']) {
    const response = await api.patch<{ result: boolean }>('/v1/roles', data)

    return response.data.result
  }

  async getNewPermissionsForRole(id: number) {
    const data = await api.get<{
      result: { id: number; name: string; description: string | null }[]
    }>(`/v1/roles/${id}/permissions/new`)
    return data.data.result
  }

  async addNewPermissionsToRole(id: number, permissionIds: number[]) {
    const data = await api.post(`/v1/roles/${id}/permissions`, {
      permissionIds,
    })
    return data.data.result
  }
}

const roleApi = new RoleApi()

export default roleApi
