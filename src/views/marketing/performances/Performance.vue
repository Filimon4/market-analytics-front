<template>
  <InfoDataEntityV2
    v-model="triggerUpdate"
    :fetch-data-req="async () => channelPerformanceApi.getTableEntity(channelPerformanceId)"
    :save-data-req="channelPerformanceApi.saveEntity"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import channelPerformanceApi from '@/src/utils/api/channelPerformance'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const dialog = useDialog()
  const router = useRouter()
  const route = useRoute()
  const channelPerformanceId = computed(() => Number(route.params.id))
  const triggerUpdate = ref<boolean>(false)

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

      await channelPerformanceApi.restoreEntity(channelPerformanceId.value)
      triggerUpdate.value = true
    }
  }
</script>
