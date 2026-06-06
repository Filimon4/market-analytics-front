import type { ITableRow } from './infoTable.base'
import type { IProject } from './project'

export const invitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  DECLINED: 'DECLINED',
}

export interface IInvitation extends ITableRow {
  email: string
  token: string
  invitedById: string
  projectId: string
  acceptedAt: Date | null
  expiresAt: Date
  createdAt: Date
  status: keyof typeof invitationStatus
}

export type InvitationWithProject = IInvitation & { project: IProject }
