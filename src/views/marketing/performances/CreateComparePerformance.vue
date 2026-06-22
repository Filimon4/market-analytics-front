<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="channelPerformanceApi.getCreateTable"
    :save-data-req="channelPerformanceApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import channelPerformanceApi from '@/src/utils/api/channelPerformance'
</script>
