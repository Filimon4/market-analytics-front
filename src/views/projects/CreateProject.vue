<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="projectApi.getCreateTable"
    :save-data-req="projectApi.createProject"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import projectApi from '@/src/utils/api/project'
</script>
