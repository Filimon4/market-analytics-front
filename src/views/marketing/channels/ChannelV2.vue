<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => channelApi.getTableEntity(channelId)"
    :save-data-req="channelApi.saveEntity"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import channelApi from '@/src/utils/api/channel'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))

  const handleClickAction = async (action: string) => {}
</script>
