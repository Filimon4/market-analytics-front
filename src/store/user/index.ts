import { defineStore } from "pinia";
import { computed, type Ref, ref } from "vue";

interface IUser {
  id: string;
  projectId: string;
  role: string;
  roleId: string;
}

interface IUserStore {
  isAuth: Ref<boolean>
  getUser: () => IUser
  setUser: (userData: IUser) => void
  getToken: () => string
  getProjectId: () => string
  setProjectId: (value: string) => void
}

export const useUserStore = defineStore('useUserStore', (): IUserStore => {
  const isAuth: IUserStore['isAuth'] = computed(() => true)
  const user = ref<IUser>()
  const projectId = ref<string>('')

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

  const getProjectId: IUserStore['getProjectId'] = (): string => {
    return projectId.value;
  }
  const setProjectId: IUserStore['setProjectId'] = (value: string) => {
    projectId.value = value
  }

  return {
    isAuth,
    setUser,
    getUser,
    getToken,
    getProjectId,
    setProjectId
  }
})

