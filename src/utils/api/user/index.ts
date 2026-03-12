import api from "..";
import type { IUser } from "../models/user"
import type { IUserToProject, IUserToProjectTableCurrent } from "../models/userToProject";

class UserApi {

  async getCurrent(): Promise<IUser> {
    const { data } = await api.get<IUser>('/v1/user/current')
    return data
  }

  async getAllProjects(): Promise<IUserToProject[]> {
    const { data } = await api.get<IUserToProject[]>('/v1/project/all')
    return data
  }

  async getTable(): Promise<IUserToProjectTableCurrent> {
    const { data: { result } } = await api.get<{result: IUserToProjectTableCurrent}>('/v1/user/table/current')
    return result
  }
}

const userApi = new UserApi();

export default userApi;