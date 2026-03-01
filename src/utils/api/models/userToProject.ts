export interface IUserToProject {
  id: string,
  blocked: boolean,
  projectId: string,
  roleId: string,
  project: {
    id: string,
    name: string,
    description: string
  }
}