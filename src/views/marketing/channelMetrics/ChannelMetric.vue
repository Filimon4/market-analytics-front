<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => channelMetricsApi.getTableEntity(channelId, metricId)"
    :save-data-req="async data => channelMetricsApi.saveEntity(channelId, data)"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import channelMetricsApi from '@/src/utils/api/channelMetrics'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))
  const metricId = computed(() => Number(route.params.metricId))
</script>
