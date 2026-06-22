<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="strategyApi.getCreateTable"
    :save-data-req="strategyApi.createStrategy"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import strategyApi from '@/src/utils/api/strategy'
</script>
