<template>
  <InfoDataCreateEntity
    :fetch-data-req="apiKeysApi.getCreateTable"
    :save-data-req="apiKeysApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import apiKeysApi from '@/src/utils/api/apikeys'
</script>
