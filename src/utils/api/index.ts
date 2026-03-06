import { useUserStore } from '@/src/store/user'
import axios, { type AxiosInstance, type AxiosError } from 'axios'
import authApi from './auth'

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }
    if (userStore.tenantId) {
      config.headers['x-tenant-id'] = userStore.tenantId
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const userStore = useUserStore()
    const originalRequest: any = error.config

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const token = await authApi.refresh()

        userStore.accessToken = token

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${token}`

        return api(originalRequest)
      } catch (refreshError) {
        userStore.accessToken = null
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api