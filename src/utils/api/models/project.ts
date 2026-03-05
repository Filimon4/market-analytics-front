export interface IProject {
  id: string,
  name: string,
  description: string
  createdAt: string
}

export type IProjectPick<T extends keyof IProject> = Pick<IProject, T> 