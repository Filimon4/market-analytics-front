<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="apiKeysApi.getCreateTable"
    :save-data-req="apiKeysApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import apiKeysApi from '@/src/utils/api/apikeys'
</script>
