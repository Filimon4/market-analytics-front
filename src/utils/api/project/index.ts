import api from "..";
import type { IProject } from "../models/project";
import type { IUserToProject } from "../models/userToProject";

class ProjectApi {

  async getConnectedProjects(): Promise<IUserToProject[]> {
    const { data } = await api.get<{result: IUserToProject[]}>('/v1/global/project/all')
    return data.result
  }

  async getProject(conntectedToProjectId: string): Promise<IProject> {
    const {data} = await api.get<{result: IProject}>('/v1/global/project', {
      params: {
        userToProjectId: conntectedToProjectId
      }
    })

    return data.result
  }
}

const projectApi = new ProjectApi();

export default projectApi;