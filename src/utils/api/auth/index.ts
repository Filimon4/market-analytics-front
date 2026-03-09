import axios, { type AxiosRequestConfig } from "axios"
import api from ".."
import { useUserStore } from "@/src/store/user"


export class AuthApi {

  async signin(email: string, password: string) {
    const { data: { token } } = await api.post<{token: string}>('/v1/auth/signin', {
      email,
      password
    }, {
      withCredentials: true
    })

    return token
  }

  async singup(email: string, password: string) {
    const { data: { token } } = await api.post<{token: string}>('/v1/auth/singup', {
      email,
      password
    }, {
      withCredentials: true
    })

    return token 
  }

  async refresh() {
    const config: AxiosRequestConfig = {}

    config.baseURL = import.meta.env.VITE_API_BASE_URL_API
    config.withCredentials = true

    const userStore = useUserStore()
    if (userStore.accessToken) {
      config.headers!.Authorization = `Bearer ${userStore.accessToken}`
    }

    const { data: { token } } = await axios.post<{ token: string }>(
      '/v1/auth/refresh',
      {},
      config
    )


    return token
  }

}

const authApi = new AuthApi()

export default authApi