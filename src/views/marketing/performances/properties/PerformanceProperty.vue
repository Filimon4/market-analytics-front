<template>
  <InfoDataEntityV2
    :fetch-data-req="
      async () => channelPerformancePropertyApi.getTableEntity(channelPerformanceId, propertyId)
    "
    :save-data-req="
      async data => channelPerformancePropertyApi.saveEntity(channelPerformanceId, data)
    "
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import channelPerformancePropertyApi from '@/src/utils/api/channelPerformanceProperty'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelPerformanceId = computed(() => Number(route.params.id))
  const propertyId = computed(() => Number(route.params.propertyId))
</script>
