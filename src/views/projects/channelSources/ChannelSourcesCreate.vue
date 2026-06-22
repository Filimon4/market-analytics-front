<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="channelSrouceApi.getCreateTable"
    :save-data-req="channelSrouceApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import channelSrouceApi from '@/src/utils/api/channelSource'
</script>
