import api from "..";
import type { ICurrentUser } from "../models/user"
import type { IUserToProject } from "../models/userToProject";

class UserApi {

  async getCurrent(): Promise<ICurrentUser> {
    const { data } = await api.get<ICurrentUser>('/v1/user/current')
    return data
  }

  async getAllProjects(): Promise<IUserToProject[]> {
    const { data } = await api.get<IUserToProject[]>('/v1/project/all')
    return data
  }
}

const userApi = new UserApi();

export default userApi;