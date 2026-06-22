<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="channelApi.getCreateTable"
    :save-data-req="channelApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import channelApi from '@/src/utils/api/channel'
</script>
