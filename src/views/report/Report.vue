<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => reportApi.getTableEntity(id)"
    :save-data-req="reportApi.saveEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import reportApi from '@/src/utils/api/report'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const id = computed(() => Number(route.params.id))
</script>
