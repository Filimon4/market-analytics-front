<template>
  <InfoDataEntityV2
    v-model:refresh-data="triggerEntityUpdate"
    :fetch-data-req="async () => ufChannelsApi.getTableEntity(channelId, propertyId)"
    :save-data-req="async data => ufChannelsApi.saveEntity(channelId, data)"
    @click:action="handleAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import ufChannelsApi from '@/src/utils/api/ufChannels'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const channelId = computed(() => Number(route.params.id))
  const propertyId = computed(() => Number(route.params.propertyId))
  const triggerEntityUpdate = ref(false)

  const handleAction = async (action: string) => {
    if (action === 'delete') {
      const isDeleted = await ufChannelsApi.deleteEntity(channelId.value, propertyId.value)
      if (isDeleted) {
        triggerEntityUpdate.value = true
      }
    } else if (action === 'restore') {
      const isRestored = await ufChannelsApi.restoreEntity(channelId.value, propertyId.value)
      if (isRestored) {
        triggerEntityUpdate.value = true
      }
    }
  }
</script>
