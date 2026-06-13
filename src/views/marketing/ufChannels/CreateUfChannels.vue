<template>
  <InfoDataCreateEntity
    :fetch-data-req="async () => ufChannelsApi.getCreateTable(channelId)"
    :save-data-req="async (data: Data) => ufChannelsApi.createEntity(channelId, data)"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import type { Data } from '@/src/utils/api/models/infoEntityV2.base'
  import ufChannelsApi from '@/src/utils/api/ufChannels'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))
</script>
