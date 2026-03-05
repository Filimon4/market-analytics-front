import type { IProject } from "@/src/utils/api/models/project"
import type { IUserToProject } from "@/src/utils/api/models/userToProject"
import projectApi from "@/src/utils/api/project"
import { defineStore } from "pinia"
import { ref, type Ref } from "vue"

interface IProjectStore {
  project: Ref<IProject | null>
  connectedProject: Ref<IUserToProject | null>
  
  updateUserProjectInfo: () => Promise<void>
}

export const useProjectStore = defineStore("useProjectStore",(): IProjectStore => {
  const project: IProjectStore['project'] = ref(null)
  const connectedProject: IProjectStore['connectedProject'] = ref(null)

  const updateUserProjectInfo = async () => {
    const data = await projectApi.getCurrent()
    connectedProject.value = data.userToProject
    project.value = data.project
    console.log(data)
  }

  return {
    project,
    connectedProject,
    updateUserProjectInfo
  }
})