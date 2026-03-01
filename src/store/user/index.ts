import api from "@/src/utils/api";
import { defineStore } from "pinia";
import { computed, type Ref, ref } from "vue";
import useProject from "../project";

interface IUserPermission {
  id: number,
  code: string,
  granted: boolean,
  parentId: null,
  childrens: IUserPermission[]
}

interface IUser {
  id: string;
  projectId: string;
  role: string;
  roleId: string;
  permissions: IUserPermission[]
}

interface IUserStore {
  isAuth: Ref<boolean>
  getUser: () => IUser
  setUser: (userData: IUser) => void
  getToken: () => string
  setToken: (value: string) => void
  getTenantId: () => string
  setTenantId: (value: string) => void
  fetchPermissions: () => Promise<void>
  getPermissions: () => IUserPermission[]
}

export const useUserStore = defineStore('useUserStore', (): IUserStore => {
  const isAuth: IUserStore['isAuth'] = computed(() => false)
  const user = ref<IUser>()
  const permissions = ref<IUserPermission[]>([])

  const setUser: IUserStore['setUser'] = (userDaa: IUser) => {
    user.value = userDaa
  }

  const getUser = (): IUser => {
    if (!user.value) throw new Error("User has not beed setted")
    return user.value
  }

  const getToken: IUserStore['getToken'] = () => {
    return localStorage.getItem('access_token') || ''
  }
  const setToken: IUserStore['setToken'] = (value: string) => {
    localStorage.setItem('access_token', value)
  } 

  const getTenantId: IUserStore['getTenantId'] = (): string => {
    return localStorage.getItem('tenantid') || ''
  }
  const setTenantId: IUserStore['setTenantId'] = (value: string) => {
    localStorage.setItem('tenantid', value)
  }

  const fetchPermissions = async () => {
    const project = useProject()

    if (!project.isSelected) {
      throw new Error("There is no project selected")
    }

    const response = await api.get<{result: IUserPermission[]}>('/v1/project/role/permissions', {
      params: {
        'x-tenant-id': project.getId()
      }
    })

    permissions.value = response.data.result
  }

  const getPermissions = () => {
    return permissions.value
  }

  return {
    isAuth,
    setUser,
    getUser,
    getToken,
    setToken,
    getTenantId,
    setTenantId,
    fetchPermissions,
    getPermissions
  }
})

