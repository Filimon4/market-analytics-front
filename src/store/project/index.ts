import type { IPanelElement } from "@/src/utils/api/models/panelElement"
import type { IPermission } from "@/src/utils/api/models/permission"
import type { IProject } from "@/src/utils/api/models/project"
import type { IRole } from "@/src/utils/api/models/role"
import type { IRolePermission } from "@/src/utils/api/models/rolePermission"
import type { IUserToProject } from "@/src/utils/api/models/userToProject"
import projectApi from "@/src/utils/api/project"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { type Ref } from "vue"

interface IProjectStore {
  project: Ref<IProject | null>
  connectedProject: Ref<IUserToProject | null>
  role: Ref<IRole | null>
  permissions: Ref<(IPermission & IRolePermission)[] | null>
  panel: Ref<IPanelElement[] | null>
  
  updateUserProjectInfo: () => Promise<void>
}

export const useProjectStore = defineStore("useProjectStore",(): IProjectStore => {
  const project: IProjectStore['project'] = useStorage('project', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    }
  }) satisfies Ref<IProject | null>

  const connectedProject: IProjectStore['connectedProject'] = useStorage('connectedProject', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    }
  }) satisfies Ref<IUserToProject | null>

  const role: IProjectStore['role'] = useStorage('role', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    }
  }) satisfies Ref<IRole | null>

  const permissions: IProjectStore['permissions'] = useStorage('permissions', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    }
  }) satisfies Ref<(IPermission & IRolePermission)[] | null>

  const panel: IProjectStore['panel'] = useStorage('panel', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    }
  }) satisfies Ref<IPanelElement[] | null>

  const updateUserProjectInfo = async () => {
    const dataProject = await projectApi.getCurrent()
    connectedProject.value = dataProject.userToProject
    project.value = dataProject.project
    const dataRole = await projectApi.gerCurrentRole()
    role.value = dataRole.role
    permissions.value = dataRole.permissions

    panel.value = await projectApi.getPanel(role.value.id)
  }

  return {
    project,
    connectedProject,
    role,
    permissions,
    panel,
    updateUserProjectInfo
  }
})