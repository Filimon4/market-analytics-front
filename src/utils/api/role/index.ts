import type { IEntity } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
import api from '..'

class RoleApi {
  async getTableList(page: number, size: number, filter: Record<string, string | number>) {
    const data = await api.post('/v1/project/role/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableById(roleId: number) {
    const data = await api.get(`/v1/project/role/table/${roleId}`)
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
    const data = await api.delete<{ result: boolean }>('/v1/project/role', {
      // TODO: сделать на бэке
      data: {
        roleId: id,
      },
    })
    return data.data.result
  }

  async saveRole(data: IEntity['data']) {
    console.log(data)
    const response = await api.patch<{ result: boolean }>('/v1/project/role', data)

    return response.data.result
  }
}

const roleApi = new RoleApi()

export default roleApi
