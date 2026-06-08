<template>
  <InfoDataEntity
    v-model="triggerUpdate"
    :fetch-data-req="async () => channelPerformanceApi.getTableEntity(channelPerformanceId)"
    :save-data-req="channelPerformanceApi.saveEntity"
    :actions="actions"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import channelPerformanceApi from '@/src/utils/api/channelPerformance'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const dialog = useDialog()
  const router = useRouter()
  const route = useRoute()
  const channelPerformanceId = computed(() => Number(route.params.id))
  const triggerUpdate = ref<boolean>(false)

  const actions = ref<Action[]>([
    {
      title: 'Востановить',
      blockCode: 'main',
      code: 'restore',
      size: 'medium',
    },
    {
      title: 'Архивировать',
      blockCode: 'main',
      code: 'archive',
      size: 'medium',
    },
    {
      title: 'Обновить метрики',
      blockCode: 'metrics',
      code: 'updateMetrics', // TODO: Обновить метрики
      size: 'medium',
    },
  ])

  const handleClickAction = async (action: string) => {
    if (action == 'archive') {
      const react = await new Promise(res =>
        dialog.warning({
          title: 'Подтверждение',
          content: 'Хотите поместить в архив?',
          positiveText: 'Да',
          negativeText: 'Нет',
          draggable: true,
          onPositiveClick: () => {
            res(true)
          },
          onNegativeClick: () => {
            res(false)
          },
        })
      )

      if (!react) return

      const response = await channelPerformanceApi.deleteEntity(channelPerformanceId.value)
      if (response) {
        router.back()
      }
    } else if (action === 'restore') {
      const react = await new Promise(res =>
        dialog.warning({
          title: 'Подтверждение',
          content: 'Хотите востановить источник?',
          positiveText: 'Да',
          negativeText: 'Нет',
          draggable: true,
          onPositiveClick: () => {
            res(true)
          },
          onNegativeClick: () => {
            res(false)
          },
        })
      )

      if (!react) return

      await channelPerformanceApi.restoreEntity(channelPerformanceId.value)
      triggerUpdate.value = true
    }
  }
</script>
