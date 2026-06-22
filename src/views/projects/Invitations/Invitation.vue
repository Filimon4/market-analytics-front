<template>
  <InfoDataEntityV2
    v-model="triggerUpdate"
    :fetch-data-req="async () => invitationApi.getTableEntity(invitationId)"
    :save-data-req="async () => true"
    @click:action="handleAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import invitationApi from '@/src/utils/api/invitation'
  import { useMessage } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const message = useMessage()

  const invitationId = computed(() => Number(route.params.id))
  const triggerUpdate = ref(false)

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
  }
</script>
