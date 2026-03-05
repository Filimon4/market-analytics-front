import api from "..";
import type { IProject, IProjectPick } from "../models/project";
import type { IUserToProject } from "../models/userToProject";

class ProjectApi {

  async getCurrent() {
    const { data: {result} } = await api.get<{result: IProject & {userToProject: IUserToProject}}>('/v1/project')
    return {
      project: {
        id: result.id,
        name: result.name,
        description: result.description,
        createdAt: result.createdAt
      },
      userToProject: result.userToProject
    } satisfies {project: IProject, userToProject: IUserToProject}
  }

  async getConnectedProjects(): Promise<Array<IUserToProject & {project: IProjectPick<'description' | 'id' | 'name'>}>> {
    const { data } = await api.get<{result: Array<IUserToProject & {project: IProjectPick<'description' | 'id' | 'name'>}>}>('/v1/global/project/all')
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