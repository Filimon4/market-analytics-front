<template>
  <InfoDataCreateEntity
    :fetch-data-req="channelApi.getCreateTable"
    :save-data-req="channelApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import channelApi from '@/src/utils/api/channel'
</script>
