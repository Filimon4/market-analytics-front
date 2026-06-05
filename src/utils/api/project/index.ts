import api from '..'
import type { IEntity } from '../models/infoEntity.base'
import type { IPanelElement } from '../models/panelElement'
import type { IPermission } from '../models/permission'
import type { IProject, IProjectPick } from '../models/project'
import type { IRole } from '../models/role'
import type { IRolePermission } from '../models/rolePermission'
import type { IUserToProject } from '../models/userToProject'

class ProjectApi {
  async getCurrent() {
    const {
      data: { result },
    } = await api.get<{ result: IProject & { userToProject: IUserToProject } }>('/v1/project')
    return {
      project: {
        id: result.id,
        name: result.name,
        description: result.description,
        createdAt: result.createdAt,
      },
      userToProject: result.userToProject,
    } satisfies { project: IProject; userToProject: IUserToProject }
  }

  async gerCurrentRole() {
    const {
      data: { result },
    } = await api.get<{
      result: IRole & { rolePermission: (IRolePermission & { persmission: IPermission })[] }
    }>('/v1/project/roles/current')
    return {
      role: {
        id: result.id,
        code: result.code,
        default: result.default,
        projectId: result.projectId,
      },
      permissions: result.rolePermission.map(rolePerm => ({
        granted: rolePerm.granted,
        permissionId: rolePerm.permissionId,
        code: rolePerm.persmission.code,
      })),
    }
  }

  async getConnectedProjects(): Promise<
    Array<
      IUserToProject & { project: IProjectPick<'description' | 'id' | 'name'>; isOwner: boolean }
    >
  > {
    const { data } = await api.get<{
      result: Array<
        IUserToProject & { project: IProjectPick<'description' | 'id' | 'name'>; isOwner: boolean }
      >
    }>('/v1/global/project/all')
    return data.result
  }

  async getProject(conntectedToProjectId: string): Promise<IProject & { projectId: string }> {
    const {
      data: { result },
    } = await api.get<{ result: IProject & { projectId: string } }>('/v1/global/project', {
      params: {
        userToProjectId: conntectedToProjectId,
      },
    })

    return result
  }

  async getPanel(roleId: number) {
    const {
      data: { result },
    } = await api.get<{ result: IPanelElement[] }>('/v1/project/panel', {
      params: {
        roleId,
      },
    })

    return result
  }

  async getTableById(projectId: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/global/project/table/${projectId}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/global/project/table/create`)
    return data.data.result
  }

  async createProject(dto: IEntity['data']) {
    const data = await api.post<{ result: IProject }>('/v1/global/project', dto)
    return data.data.result
  }

  async updateProject(dto: IEntity['data']) {
    await api.patch<{ result: IProject }>(`/v1/project/${dto.id}`, dto)
    return true
  }
}

const projectApi = new ProjectApi()

export default projectApi
