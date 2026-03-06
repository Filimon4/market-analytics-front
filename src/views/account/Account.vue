<template>
    <div class="layout-container">
        <div class="info-container">
            <div class="info-label">
                Пользователь
            </div>
            <n-spin :show="loading">
                <n-grid :cols="1" class="info-content" :y-gap='10'>
                    <n-grid-item class="content-block">
                        <div class="block-label">Имя</div>
                        <div class="block-content">{{ userStore.user?.name ?? '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Почта</div>
                        <div class="block-content">{{ userStore.user?.email ?? '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Дата регистрации</div>
                        <div class="block-content">{{ formatedCreatedAt(userStore.user?.createdAt!) }}</div>
                    </n-grid-item>
                </n-grid>
            </n-spin>
        </div>
        <div class="info-container">
            <div class="info-label">
                Проект
            </div>
            <n-spin :show="loading">
                <n-grid :cols="1" class="info-content" :y-gap='10'>
                    <n-grid-item class="content-block">
                        <div class="block-label">Текущий проект</div>
                        <div class="block-content">{{ projectStore.project?.name || '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Роль в проекте</div>
                        <div class="block-content">{{ projectStore?.role?.code ?? '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Дата входа</div>
                        <div class="block-content">{{ formatedCreatedAt(projectStore.connectedProject?.createdAt || '') }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Статус</div>
                        <div v-if="projectStore?.connectedProject?.blocked !== undefined" class="block-content">{{ !projectStore?.connectedProject?.blocked ? "Активен" : "Заблокирован" }}</div>
                        <div v-else class="block-content">{{ '—' }}</div>
                    </n-grid-item>
                </n-grid>
            </n-spin>
            <div class="container-actions">
                <div class="action" @click="onOpenPorjctPicker">
                    Поменять проект
                </div>
                <div class="action">
                    Добавить проект
                </div>
            </div>
            <project-modal
                v-model:show="showProjectPicker"
                :items="[]"
                :initial-selected-id="selectedProject?.id || null"
                :title="'Проекты'"
                :placeholder="'Поиск проекта...'"
                :load-items="loadProjects"
                @confirm="onProjectConfirm"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectModal from '@/src/components/ui/projectModal/projectModal.vue'
import projectApi from '@/src/utils/api/project'
import type { IProjectModalItem } from '@/src/components/ui/projectModal/projectModal.types'
import { useUserStore } from '@/src/store/user'
import { useProjectStore } from '@/src/store/project'
import { DateTime } from 'luxon'

const userStore = useUserStore()
const projectStore = useProjectStore()
const loading = ref(false)

// #region: project modal

const showProjectPicker = ref(false)
const selectedProject = ref<IProjectModalItem | null>(null)

const onProjectConfirm = async (item: IProjectModalItem) => {
    const project = await projectApi.getProject(item.id)
    selectedProject.value = item
    userStore.tenantId = Number(project.id)
    showProjectPicker.value = false
    projectStore.updateUserProjectInfo()
}

const onOpenPorjctPicker = () => {
    showProjectPicker.value = true
}

const loadProjects = async (): Promise<IProjectModalItem[]> => {
    const connectecProjects = await projectApi.getConnectedProjects()
    return connectecProjects.map(conn => ({
        id: conn.id,
        name: conn.project.name,
        description: conn.project.description
    }))
}

// #endregion

const formatedCreatedAt = (date: string) => {
  if (!date) return '—'
  return DateTime.fromISO(date)
    .setLocale('ru')
    .toLocaleString(DateTime.DATETIME_HUGE);
}
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