<template>
  <InfoDataCreateEntity
    :fetch-data-req="channelSrouceApi.getCreateTable"
    :save-data-req="channelSrouceApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import channelSrouceApi from '@/src/utils/api/channelSource'
</script>
