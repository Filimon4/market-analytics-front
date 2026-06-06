<template>
  <InfoDataEntity
    v-model="triggerUpdate"
    :fetch-data-req="async () => invitationApi.getTableEntity(invitationId)"
    :save-data-req="async () => true"
    :actions="actions"
    @click:action="handleAction"
  />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import invitationApi from '@/src/utils/api/invitation'
  import { useMessage } from 'naive-ui'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const message = useMessage()

  const invitationId = computed(() => Number(route.params.id))
  const triggerUpdate = ref(false)
  const actions = ref<Action[]>([])

  const allActions: Action[] = [
    {
      title: 'Отправить заного',
      code: 'resend',
      size: 'medium',
      blockCode: 'main',
    },
    {
      title: 'Отменить',
      code: 'cancel',
      size: 'medium',
      blockCode: 'main',
    },
  ]

  const updateAvailableActions = async () => {
    if (!invitationId.value || Number.isNaN(invitationId.value)) {
      actions.value = []
      return
    }

    const availableCodes = await invitationApi.getAvailableActions(invitationId.value)
    actions.value = allActions.filter(action => availableCodes.includes(action.code))
  }

  const handleAction = async (actionCode: string) => {
    const actionHandlers: Record<string, () => Promise<boolean>> = {
      resend: () => invitationApi.resend(invitationId.value),
      cancel: () => invitationApi.cancel(invitationId.value),
    }

    const handler = actionHandlers[actionCode]
    if (!handler) {
      return
    }

    const result = await handler().catch(() => null)
    if (!result) {
      return
    }

    message.success('Действие выполнено')
    triggerUpdate.value = true
    await updateAvailableActions()
  }

  onMounted(() => {
    updateAvailableActions()
  })
</script>
