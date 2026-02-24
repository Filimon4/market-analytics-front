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
  isInitialized: Ref<boolean>
  getUser: () => IUser
  setUser: (userData: IUser) => void
  getToken: () => string
  setToken: (value: string) => void
  getProjectId: () => string
  setProjectId: (value: string) => void
  setInitialized: (value: boolean) => void
}

export const useUserStore = defineStore('useUserStore', (): IUserStore => {
  const isAuth: IUserStore['isAuth'] = computed(() => true)
  const isInitialized: IUserStore['isInitialized'] = computed(() => false)
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
  const setToken: IUserStore['setToken'] = (value: string) => {
    localStorage.setItem('access_token', value)
  } 

  const getProjectId: IUserStore['getProjectId'] = (): string => {
    return projectId.value;
  }
  const setProjectId: IUserStore['setProjectId'] = (value: string) => {
    projectId.value = value
  }
  
  const setInitialized: IUserStore['setInitialized'] = (value: boolean) => {
    isInitialized.value = value
  }

  return {
    isInitialized,
    isAuth,
    setUser,
    getUser,
    getToken,
    setToken,
    getProjectId,
    setProjectId,
    setInitialized
  }
})

