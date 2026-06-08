<template>
  <InfoDataEntity
    :fetch-data-req="async () => channelApi.getTableEntity(channelPerformanceId)"
    :save-data-req="channelApi.saveEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import channelApi from '@/src/utils/api/channel'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelPerformanceId = computed(() => Number(route.params.id))
</script>
