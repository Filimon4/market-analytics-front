<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => ufChannelsApi.getTableEntity(channelId, propertyId)"
    :save-data-req="async data => ufChannelsApi.saveEntity(channelId, data)"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import ufChannelsApi from '@/src/utils/api/ufChannels'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))
  const propertyId = computed(() => Number(route.params.propertyId))
</script>
