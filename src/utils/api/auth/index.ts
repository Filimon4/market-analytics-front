import axios, { type AxiosRequestConfig } from 'axios'
import api from '..'

export class AuthApi {
  async signin(email: string, password: string) {
    const {
      data: { token },
    } = await api.post<{ token: string }>(
      '/v1/auth/signin',
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    )

    return token
  }

  async singup(email: string, password: string, name: string) {
    const {
      data: { token },
    } = await api.post<{ token: string }>(
      '/v1/auth/signup',
      {
        email,
        password,
        name,
      },
      {
        withCredentials: true,
      }
    )

    return token
  }

  async refresh() {
    const config: AxiosRequestConfig = {}

    config.baseURL = import.meta.env.VITE_API_BASE_URL_API
    config.withCredentials = true

    const {
      data: { token },
    } = await axios.post<{ token: string }>('/v1/auth/refresh', {}, config)

    return token
  }

  async logout() {
    const response = await api.post<{ result: boolean }>(
      '/v1/auth/logout',
      {},
      {
        withCredentials: true,
      }
    )

    return response.data.result
  }
}

const authApi = new AuthApi()

export default authApi
