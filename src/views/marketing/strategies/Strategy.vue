<template>
  <InfoDataEntity
    :fetch-data-req="async () => strategyApi.getTableEntity(strategyId)"
    :save-data-req="strategyApi.updateStrategy"
    :actions="actions"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import type { Action } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import strategyApi from '@/src/utils/api/strategy'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const dialog = useDialog()
  const router = useRouter()
  const route = useRoute()

  const actions = ref<Action[]>([
    {
      title: 'Востановить',
      blockCode: 'main',
      code: 'restore',
      size: 'medium',
    },
    {
      title: 'Удалить',
      blockCode: 'main',
      code: 'delete',
      size: 'medium',
    },
    {
      title: 'Добавить отчёт',
      blockCode: 'analytics',
      code: 'addReport',
      size: 'medium',
    },
  ])

  const strategyId = computed(() => Number(route.params.id))

  const handleClickAction = async (action: string) => {
    if (action == 'delete') {
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

      const response = await strategyApi.deleteStrategy(strategyId.value)
      if (response) {
        router.back()
      }
    } else if (action === 'restore') {
      const react = await new Promise(res =>
        dialog.warning({
          title: 'Подтверждение',
          content: 'Хотите востановить стратегию',
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

      await strategyApi.restoreStrategy(strategyId.value)
    } else if (action === 'addReport') {
      // TODO: Drawer
    }
  }
</script>
