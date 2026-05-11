import { useUserStore } from '@/src/store/user'
import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { createDiscreteApi } from 'naive-ui'
import authApi from './auth'

const { message } = createDiscreteApi(['message'])

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }
    if (userStore.tenantId) {
      config.headers['x-tenant-id'] = userStore.tenantId
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const userStore = useUserStore()
    const originalRequest = error.config as AxiosError['config'] & { _retryCount?: number }

    if (error.response?.status === 401) {
      originalRequest._retryCount = originalRequest._retryCount || 0
      if (originalRequest._retryCount >= 2) {
        return Promise.reject(error)
      }

      originalRequest._retryCount += 1

      try {
        const token = await authApi.refresh().catch(error => {
          if (error.status === 401) {
            userStore.accessToken = null
            userStore.user = null
            window.location.href = '/auth/signin'
          }
          throw error
        })

        userStore.accessToken = token

        originalRequest.headers = originalRequest?.headers || {}
        originalRequest.headers.Authorization = `Bearer ${token}`

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status !== 401) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error
      const fallbackMessage = error.message || 'Произошла ошибка при выполнении запроса'
      message.error(backendMessage || fallbackMessage)
    }

    return Promise.reject(error)
  }
)

export default api
