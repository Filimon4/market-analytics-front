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
                    <div class="block-label">Роль</div>
                    <div class="block-content">{{ user?.role ?? '—' }}</div>
                </n-grid-item>
                <n-grid-item class="content-block">
                    <div class="block-label">Дата регистрации</div>
                    <div class="block-content">{{ formattedCreatedAt }}</div>
                </n-grid-item>
                <n-grid-item class="content-block">
                    <div class="block-label">Статус</div>
                    <div class="block-content">{{ user?.status ?? '—' }}</div>
                </n-grid-item>
            </n-grid>
            </n-spin>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/src/utils/api'

interface CurrentUser {
  email: string
  name: string
  createdAt: string
  role: string
  status: string
}

const user = ref<CurrentUser | null>(null)
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
    const { data } = await api.get<CurrentUser>('/v1/user/current')
    user.value = data
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
    margin-top: 5px;
}

.content-block {
    display: flex;
    gap: 10px;
    align-items: center;
}

.block-label {
    min-width: 200px;
}

.error-message {
    color: var(--n-error-color);
    margin-top: 8px;
}
</style>