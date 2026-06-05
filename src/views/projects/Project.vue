<template>
  <InfoDataEntity
    :fetch-data-req="async () => projectApi.getTableById(projectId)"
    :save-data-req="projectApi.updateProject"
  />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import projectApi from '@/src/utils/api/project'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const projectId = computed(() => Number(route.params.id))
</script>
