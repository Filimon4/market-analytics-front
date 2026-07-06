import type { IPanelElement } from '@/src/utils/api/models/panelElement'
import type { IPermission } from '@/src/utils/api/models/permission'
import type { IRole } from '@/src/utils/api/models/role'
import type { IRolePermission } from '@/src/utils/api/models/rolePermission'
import projectApi from '@/src/utils/api/project'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { type Ref } from 'vue'

interface IProjectStore {
  role: Ref<IRole | null>
  permissions: Ref<(IPermission & IRolePermission)[] | null>
  panel: Ref<IPanelElement[] | null>

  updateUserProjectInfo: () => Promise<void>
}

export const useProjectStore = defineStore('useProjectStore', (): IProjectStore => {
  const role: IProjectStore['role'] = useStorage('role', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        if (!value) return ''
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    },
  }) satisfies Ref<IRole | null>

  const permissions: IProjectStore['permissions'] = useStorage('permissions', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        if (!value) return ''
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    },
  }) satisfies Ref<(IPermission & IRolePermission)[] | null>

  const panel: IProjectStore['panel'] = useStorage('panel', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      write(value) {
        console.log(`panel writer: ${value}`)
        if (!value) return ''
        return JSON.stringify(value)
      },
      read(raw) {
        return JSON.parse(raw)
      },
    },
  }) satisfies Ref<IPanelElement[] | null>

  const updateUserProjectInfo = async () => {
    const dataRole = await projectApi.gerCurrentRole()
    role.value = dataRole.role
    permissions.value = dataRole.permissions

    panel.value = await projectApi.getPanel(Number(role.value.id))
  }

  return {
    role,
    permissions,
    panel,
    updateUserProjectInfo,
  }
})
