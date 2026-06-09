<template>
  <InfoDataEntity
    v-model="triggerUpdate"
    :fetch-data-req="async () => channelApi.getTableEntity(channelId)"
    :save-data-req="channelApi.saveEntity"
    :actions="actions"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import channelApi from '@/src/utils/api/channel'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const dialog = useDialog()

  const channelId = computed(() => Number(route.params.id))
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
      title: 'Добавить отчёт',
      blockCode: 'analytics',
      code: 'addNewReport', // TODO: Добавить логику
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

      const response = await channelApi.deleteEntity(channelId.value)
      if (response) {
        router.back()
      }
    } else if (action === 'restore') {
      const react = await new Promise(res =>
        dialog.warning({
          title: 'Подтверждение',
          content: 'Хотите востановить ?',
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

      await channelApi.restoreEntity(channelId.value)
      triggerUpdate.value = true
    }
  }
</script>
