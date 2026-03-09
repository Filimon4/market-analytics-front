import api from ".."

class RoleApi {

  getTableList(page: number, size: number, filter: Record<string, string | number>) {
    return api.get('/v1/project/role/table/list', {
      params: {
        page,
        size,
        filter: JSON.stringify(filter)
      }
    })
  }

  getTableById(roleId: number) {
    return api.get(`/v1/project/role/table/${roleId}`)
  }

}

const roleApi = new RoleApi()

export default roleApi
