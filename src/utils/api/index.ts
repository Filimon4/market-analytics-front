import axios, { type AxiosInstance, type AxiosError } from 'axios'

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const tenantid = localStorage.getItem('tenantid')
    if (tenantid) {
      config.headers['x-tenant-id'] = tenantid
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post<{ token: string }>(
          '/v1/auth/refresh',
          {},
          {
            baseURL: import.meta.env.VITE_API_BASE_URL,
            withCredentials: true,
          }
        )

        localStorage.setItem('access_token', data.token)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${data.token}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api