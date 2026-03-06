import axios from "axios"
import api from ".."


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
    const { data: { token } } = await axios.post<{ token: string }>(
      '/v1/auth/refresh',
      {},
      {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
      }
    )


    return token
  }

}

const authApi = new AuthApi()

export default authApi