<template>
  <InfoDataCreateEntity
    :fetch-data-req="async () => channelMetricsApi.getCreateTable(channelId)"
    :save-data-req="async (data: Data) => channelMetricsApi.createEntity(channelId, data)"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import channelMetricsApi from '@/src/utils/api/channelMetrics'
  import type { Data } from '@/src/utils/api/models/infoEntityV2.base'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))
</script>
