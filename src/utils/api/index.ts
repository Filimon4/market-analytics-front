import axios, { type AxiosInstance } from 'axios'

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
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { data } = await axios.post<{token: string}>('/v1/auth/refresh', {}, {
        baseURL: import.meta.env.VITE_API_BASE_URL
      }).catch((error) => {
        localStorage.removeItem('access_token')
        // window.location.href = '/auth/signin'
        throw error
      })

      localStorage.setItem('access_token', data.token)
    }
    return Promise.reject(error)
  }
)

export default api