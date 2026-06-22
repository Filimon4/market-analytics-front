import type { IEntity } from '@/src/utils/api/models/infoEntityV2.base'
import api from '..'
import type { ITableFilterValue, ITableList } from '../models/infoTable.base'
import type { IInvitation, InvitationWithProject } from '../models/invitation'

class InvitationApi {
  async resend(id: number) {
    const response = await api.post<{ result: boolean }>(`/v1/invitations/${id}/resend`)

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

  async cancel(id: number) {
    const response = await api.patch<{ result: boolean }>(`/v1/invitations/${id}/cancel`)

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

  async getTableList(
    page: number,
    size: number,
    filter: Record<string, ITableFilterValue>
  ): Promise<ITableList<IInvitation>> {
    const data = await api.post<{ result: ITableList<IInvitation> }>('/v1/invitations/table/list', {
      page,
      size,
      filter,
    })

    return data.data.result
  }

  async getTableEntity(id: number) {
    const data = await api.get<{ result: IEntity }>(`/v1/invitations/table/${id}`)
    return data.data.result
  }

  async getCreateTable() {
    const data = await api.get(`/v1/invitations/table/create`)
    return data.data.result
  }

  async getAvailableActions(id: number) {
    const data = await api.get<{ result: { actions: string[] } }>(`/v1/invitations/actions/${id}`)
    return data.data.result.actions
  }
}

const invitationApi = new InvitationApi()

export default invitationApi
