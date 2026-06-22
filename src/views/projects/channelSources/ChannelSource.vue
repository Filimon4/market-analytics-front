<template>
  <InfoDataEntityV2
    v-model="triggerUpdate"
    :fetch-data-req="async () => channelSrouceApi.getTableEntity(channelSourceId)"
    :save-data-req="channelSrouceApi.saveChannelSource"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import channelSrouceApi from '@/src/utils/api/channelSource'
  import { useDialog } from 'naive-ui'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()
  const dialog = useDialog()

  const channelSourceId = computed(() => Number(route.params.id))

  const triggerUpdate = ref(false)

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

      const response = await channelSrouceApi.deleteEntity(channelSourceId.value)
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

      await channelSrouceApi.restoreEntity(channelSourceId.value)
      triggerUpdate.value = true
    }
  }
</script>
