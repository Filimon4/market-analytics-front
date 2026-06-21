<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => reportTypeApi.getTableEntity(id)"
    :save-data-req="reportTypeApi.saveEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import reportTypeApi from '@/src/utils/api/reportType'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const id = computed(() => Number(route.params.id))
</script>
