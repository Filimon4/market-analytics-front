<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => apiKeysApi.getTableById(apiKeyId)"
    :save-data-req="apiKeysApi.saveApiKey"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import apiKeysApi from '@/src/utils/api/apikeys'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const apiKeyId = computed(() => Number(route.params.id))
</script>
