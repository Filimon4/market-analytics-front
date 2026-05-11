import api from '..'
import type { IInvitation, InvitationWithProject } from '../models/invitation'

class InvitationApi {
  async resend(token: string) {
    const response = await api.patch<{ result: boolean }>(`/v1/invitations/${token}/resend`)

    return response.data.result
  }

  async accept(token: string) {
    const response = await api.patch<{ result: boolean }>(`/v1/invitations/${token}/accept`)

    return response.data.result
  }

  async decline(token: string) {
    const response = await api.patch<{ result: boolean }>(`/v1/invitations/${token}/decline`)

    return response.data.result
  }

  async cancel(token: string) {
    const response = await api.patch<{ result: boolean }>(`/v1/invitations/${token}/cancel`)

    return response.data.result
  }

  async create(email: string) {
    const response = await api.post<{ result: boolean }>(`/v1/invitations`, {
      email,
    })

    return response.data.result
  }

  async getList(page: number = 1, size: number = 10, filter: Record<string, string | number>) {
    const response = await api.get<{ result: IInvitation }>(`/v1/invitations`, {
      params: {
        page,
        size,
        filter,
      },
    })

    return response.data.result
  }

  async getByToken(token: string): Promise<InvitationWithProject> {
    const response = await api.get<{ result: InvitationWithProject }>(`/v1/invitations/${token}`)

    return response.data.result
  }
}

const invitationApi = new InvitationApi()

export default invitationApi
