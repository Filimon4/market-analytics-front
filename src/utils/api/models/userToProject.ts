export interface IUserToProject {
  id: string
  blocked: boolean
  projectId: string
  roleId: string
  createdAt: string
}

export type IUserToProjectPick<T extends keyof IUserToProject> = Pick<IUserToProject, T>
export type IUserToProjectEclude<T extends keyof IUserToProject> = Omit<IUserToProject, T>
