<template>
  <InfoDataEntity
    :fetch-data-req="async () => channelSrouceApi.getTableEntity(channelSourceId)"
    :save-data-req="channelSrouceApi.saveChannelSource"
  />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import channelSrouceApi from '@/src/utils/api/channelSource'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelSourceId = computed(() => Number(route.params.id))
</script>
