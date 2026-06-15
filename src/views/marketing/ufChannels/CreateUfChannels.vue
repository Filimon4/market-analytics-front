<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="async () => ufChannelsApi.getCreateTable(channelId)"
    :save-data-req="async (data: Data) => ufChannelsApi.createEntity(channelId, data)"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'
  import type { Data } from '@/src/utils/api/models/infoEntityV2.base'
  import ufChannelsApi from '@/src/utils/api/ufChannels'
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))

  onMounted(() => {
    infoDataEntityStore.setMode('create')
  })
</script>
