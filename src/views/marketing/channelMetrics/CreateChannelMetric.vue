<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="async () => channelMetricsApi.getCreateTable(channelId)"
    :save-data-req="async (data: Data) => channelMetricsApi.createEntity(channelId, data)"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'
  import channelMetricsApi from '@/src/utils/api/channelMetrics'
  import type { Data } from '@/src/utils/api/models/infoEntityV2.base'
  import { onMounted } from 'vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))

  onMounted(() => {
    infoDataEntityStore.setMode('create')
  })
</script>
