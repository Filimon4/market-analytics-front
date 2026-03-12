export interface IUserToProject {
  id: string,
  blocked: boolean,
  projectId: string,
  roleId: string,
  createdAt: string
}

export interface IUserToProjectTableCurrent {
  blocks: {
    name: string,
    code: string,
    columnCapacity: number,
    maxColumns: number
  }[],
  blockDetails: {
    blockCode: string,
    fields: {
      title: string,
      path: string,
      editable: boolean,
      type: string,
      editPath: string,
    }[]
  }[],
  data: {
    name: string,
    email: string,
    createdAt: string,
    blockCode: string
  }[]
}

export type IUserToProjectPick<T extends keyof IUserToProject> = Pick<IUserToProject, T> 
export type IUserToProjectEclude<T extends keyof IUserToProject> = Omit<IUserToProject, T>