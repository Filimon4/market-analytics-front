<template>
  <InfoDataEntity :fetch-data-req="async () => apiKeysApi.getTableById(apiKeyId)" />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import apiKeysApi from '@/src/utils/api/apikeys'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const apiKeyId = computed(() => Number(route.params.id))
</script>
