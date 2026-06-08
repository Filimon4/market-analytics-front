<template>
  <InfoDataCreateEntity
    :fetch-data-req="channelPerformanceApi.getCreateTable"
    :save-data-req="channelPerformanceApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import channelPerformanceApi from '@/src/utils/api/channelPerformance'
</script>
