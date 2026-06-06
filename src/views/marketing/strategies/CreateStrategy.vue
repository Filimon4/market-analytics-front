<template>
  <InfoDataCreateEntity
    :fetch-data-req="strategyApi.getCreateTable"
    :save-data-req="strategyApi.createStrategy"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import strategyApi from '@/src/utils/api/strategy'
</script>
