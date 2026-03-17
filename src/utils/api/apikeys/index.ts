import api from ".."

class ApiKeysApi {

  async getTableList(page: number, size: number, filter: Record<string, string | number>) {
    const data = await api.post('/v1/project/api-keys/table/list', {
      page,
      size,
      filter
    })

    return data.data.result
  }

  async getTableById(apiKeyId: number) {
    const data = await api.get(`/v1/project/api-keys/table/${apiKeyId}`)
    return data.data.result
  }

}

const apiKeysApi = new ApiKeysApi()

export default apiKeysApi;
