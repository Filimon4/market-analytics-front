<template>
  <InfoDataCreateEntity
    :fetch-data-req="projectApi.getCreateTable"
    :save-data-req="projectApi.createProject"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import projectApi from '@/src/utils/api/project'
</script>
