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
}

const roleApi = new RoleApi()

export default roleApi
