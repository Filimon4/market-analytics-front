<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => strategyApi.getTableEntity(strategyId)"
    :save-data-req="strategyApi.updateStrategy"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import strategyApi from '@/src/utils/api/strategy'
  import { useDialog } from 'naive-ui'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const dialog = useDialog()
  const router = useRouter()
  const route = useRoute()

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
