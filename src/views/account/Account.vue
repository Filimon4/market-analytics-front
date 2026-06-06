<template>
  <InfoDataEntity
    :fetch-data-req="userApi.getTable"
    :actions="actions"
    :save-data-req="async () => false"
    @click:action="handleAction"
    v-model="triggerTableUpdate"
  />
  <project-modal
    v-model:show="showProjectPicker"
    :items="[]"
    :initial-selected-id="selectedProject?.id || null"
    :title="'Проекты'"
    :placeholder="'Поиск проекта...'"
    :load-items="loadProjects"
    @confirm="onProjectConfirm"
  />
</template>

<script setup lang="ts">
  import projectApi from '@/src/utils/api/project'
  import type { IProjectModalItem } from '@/src/components/Ui/ProjectModal/ProjectModal.types'
  import { useUserStore } from '@/src/store/user'
  import { useProjectStore } from '@/src/store/project'
  import type { Action } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import userApi from '@/src/utils/api/user'
  import { ref } from 'vue'
  import authApi from '@/src/utils/api/auth'
  import ProjectModal from '@/src/components/Ui/ProjectModal/ProjectModal.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const actions = ref<Action[]>([
    {
      title: 'Выйти',
      code: 'logout',
      size: 'medium',
      blockCode: 'main',
    },
    {
      title: 'Поменять проект',
      code: 'changeProject',
      size: 'medium',
      blockCode: 'project',
    },
    {
      title: 'Добавить новый',
      code: 'addProject',
      size: 'medium',
      blockCode: 'project',
    },
  ])

  const triggerTableUpdate = ref<boolean>(false)
  const userStore = useUserStore()
  const projectStore = useProjectStore()

  const showProjectPicker = ref(false)
  const selectedProject = ref<IProjectModalItem | null>(null)

  const handleAction = async (actionCode: string) => {
    if (actionCode === 'changeProject') {
      showProjectPicker.value = true
    } else if (actionCode === 'logout') {
      const result = await authApi.logout()

      if (!result) return

      projectStore.panel = null
      projectStore.permissions = null
      projectStore.role = null
      userStore.isAuth = false
      userStore.tenantId = null
      userStore.accessToken = null
      userStore.user = null
      window.location.href = '/auth/signin'
    } else if (actionCode === 'addProject') {
      router.push('projects/create')
    }
  }

  // #region ProjectModal

  const onProjectConfirm = async (item: IProjectModalItem) => {
    showProjectPicker.value = false
    selectedProject.value = item

    const project = await projectApi.getProject(item.id)
    userStore.tenantId = BigInt(project.projectId)

    projectStore.updateUserProjectInfo()
    triggerTableUpdate.value = true
  }

  const loadProjects = async (): Promise<IProjectModalItem[]> => {
    const connectecProjects = await projectApi.getConnectedProjects()
    return connectecProjects.map(conn => ({
      id: conn.id,
      projectId: conn.project.id,
      name: conn.project.name,
      description: conn.project.description,
      isOwner: conn.isOwner,
    }))
  }

  // #endregion
</script>

<style>
  .layout-container {
    height: 100%;
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .info-container {
    width: 100%;
    height: fit-content;
  }

  .info-label {
    background-color: black;
    color: white;
    display: inline;
    border-radius: 5px;
    padding: 5px;
  }

  .info-content {
    background-color: rgba(177, 177, 177, 0.315);
    height: fit-content;
    width: 100%;
    padding: 7px;
    margin-block: 5px;
  }

  .content-block {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .container-actions {
    width: 100%;
    display: flex;
    justify-content: right;
    gap: 10px;
  }

  .action {
    padding: 5px 10px;
    background-color: rgba(128, 128, 128, 0.212);
    border-radius: 7px;
    cursor: pointer;
  }

  .block-label {
    min-width: 200px;
  }
</style>
