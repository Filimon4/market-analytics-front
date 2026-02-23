<template>
    <div class="layout-container">
        <div class="info-container">
            <div class="info-label">
                Пользователь
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <n-spin :show="loading">
                <n-grid :cols="1" class="info-content" :y-gap='10'>
                    <n-grid-item class="content-block">
                        <div class="block-label">Имя</div>
                        <div class="block-content">{{ user?.name ?? '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Почта</div>
                        <div class="block-content">{{ user?.email ?? '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Дата регистрации</div>
                        <div class="block-content">{{ formattedCreatedAt }}</div>
                    </n-grid-item>
                </n-grid>
            </n-spin>
        </div>
        <div class="info-container">
            <div class="info-label">
                Проект
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <n-spin :show="loading">
                <n-grid :cols="1" class="info-content" :y-gap='10'>
                    <n-grid-item class="content-block">
                        <div class="block-label">Текущий проект</div>
                        <div class="block-content">{{ '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Роль в проекте</div>
                        <div class="block-content">{{ user?.role ?? '—' }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Дата входа</div>
                        <div class="block-content">{{ formattedCreatedAt }}</div>
                    </n-grid-item>
                    <n-grid-item class="content-block">
                        <div class="block-label">Статус</div>
                        <div class="block-content">{{ user?.status ?? '—' }}</div>
                    </n-grid-item>
                </n-grid>
            </n-spin>
            <div class="container-actions">
                <div class="action">
                    Поменять проект
                </div>
                <div class="action">
                    Добавить проект
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ICurrentUser } from '@/src/utils/api/models/user'
import userApi from '@/src/utils/api/user'

const user = ref<ICurrentUser | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const formattedCreatedAt = computed(() => {
  if (!user.value?.createdAt) return '—'
  return new Date(user.value.createdAt).toLocaleString('ru-RU')
})

async function fetchCurrentUser() {
  loading.value = true
  error.value = null
  try {
    user.value = await userApi.getCurrent()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Не удалось загрузить данные'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCurrentUser)
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

.error-message {
    color: var(--n-error-color);
    margin-top: 8px;
}
</style>