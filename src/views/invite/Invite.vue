<template>
  <div class="invite-page">
    <div class="invite-card">
      <n-spin v-if="loading && status === 'pending'" class="invite-spin" />

      <template v-else>
        <template v-if="invitation && status === 'pending'">
          <n-result status="info" title="Приглашение">
            <template #default>
              <p class="invite-summary">
                Проект: {{ invitation.project.name }}
                <br />
                <span v-if="invitation.project.description">
                  {{ invitation.project.description }}
                </span>
                <span v-else>Описание проекта отсутствует.</span>
              </p>
            </template>
            <template #footer>
              <div class="invite-actions">
                <n-button type="primary" @click="onAccept"> Принять приглашение </n-button>
                <n-button tertiary @click="onDecline">Отклонить</n-button>
              </div>
            </template>
          </n-result>
        </template>
        <template v-else-if="status === 'success'">
          <n-result status="success" title="Приглашение принято">
            <template #footer>
              <n-button type="primary" @click="onDasboard">На главную</n-button>
            </template>
          </n-result>
        </template>
        <template v-else-if="status === 'decline'">
          <n-result status="info" title="Приглашение отклонено">
            <template #footer>
              <n-button type="primary" @click="onDasboard">На главную</n-button>
            </template>
          </n-result>
        </template>
        <template v-else-if="status === 'error'">
          <n-result status="error" title="Ошикба">
            <template #footer>
              <n-button type="primary" @click="fetchInvitation">Попробовать снова</n-button>
            </template>
          </n-result>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import type { InvitationWithProject } from '@/src/utils/api/models/invitation'
  import invitationApi from '@/src/utils/api/invitation'
  import { NButton, NResult } from 'naive-ui'

  const router = useRouter()
  const route = useRoute()
  const token = computed(() => String(route.query.token || ''))

  const loading = ref(true)

  const status = ref<'pending' | 'success' | 'error' | 'decline'>('pending')
  const invitation = ref<InvitationWithProject | null>(null)
  const errorMessage = ref<string | null>(null)

  async function fetchInvitation() {
    status.value = 'pending'
    errorMessage.value = null

    const t = token.value
    if (!t) return

    loading.value = true
    invitation.value = null

    try {
      invitation.value = await invitationApi.getByToken(token.value)
    } catch {
      status.value = 'error'
    } finally {
      loading.value = false
    }
  }

  async function onAccept() {
    const t = token.value
    if (!t) return

    const result = await invitationApi
      .accept(token.value)
      .catch((err: unknown) => {
        status.value = 'error'
        throw err
      })
      .catch(() => null)

    if (!result) return
    status.value = 'success'
  }

  async function onDecline() {
    const t = token.value
    if (!t) return

    const result = await invitationApi
      .decline(token.value)
      .catch((err: unknown) => {
        status.value = 'error'
        throw err
      })
      .catch(() => null)

    if (!result) return
    status.value = 'decline'
  }

  function onDasboard() {
    router.push('/')
  }

  onMounted(() => {
    fetchInvitation()
  })
</script>

<style scoped lang="scss">
  .invite-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .invite-card {
    width: 100%;
    max-width: 400px;
  }

  .invite-spin {
    width: 100%;
    min-height: 120px;
  }

  .invite-title {
    text-align: center;
    font-size: 1.8rem;
    margin: 0 0 16px;
  }

  .invite-summary {
    white-space: pre-line;
    color: $color-text-body;
    margin: 0 0 24px;
    line-height: 1.5;
  }

  .invite-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .invite-muted {
    color: $color-text-muted;
    margin: 0 0 24px;
    line-height: 1.5;
  }

  .invite-hint {
    margin-top: 16px;
    text-align: center;
    color: $color-text-muted;
  }

  .invite-hint a {
    color: $color-success;
    text-decoration: none;
  }

  .invite-hint a:hover {
    text-decoration: underline;
  }
</style>
