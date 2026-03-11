import api from ".."

class RoleApi {

  async getTableList(page: number, size: number, filter: Record<string, string | number>) {
    const data = await api.post('/v1/project/role/table/list', {
      page,
      size,
      filter
    })

    return data.data.result
  }

  async getTableById(roleId: number) {
  }

}

const roleApi = new RoleApi()

export default roleApi
