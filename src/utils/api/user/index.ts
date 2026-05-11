import type { IEntity } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
import api from '..'
import type { IUser } from '../models/user'
import type { IUserToProject } from '../models/userToProject'

class UserApi {
  async getCurrent(): Promise<IUser> {
    const { data } = await api.get<IUser>('/v1/user/current')
    return data
  }

  async getAllProjects(): Promise<IUserToProject[]> {
    const { data } = await api.get<IUserToProject[]>('/v1/project/all')
    return data
  }

  async getTable(): Promise<IEntity> {
    const {
      data: { result },
    } = await api.post<{ result: IEntity }>('/v1/user/table/current')
    return result
  }

  async getTableList(page: number, size: number, filter: Record<string, string | number>) {
    const data = await api.post('/v1/project/user/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableById(roleId: number) {
    const data = await api.get(`/v1/project/user/table/${roleId}`)
    return data.data.result
  }
}

const userApi = new UserApi()

export default userApi
