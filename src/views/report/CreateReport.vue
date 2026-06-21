<template>
  <InfoDataCreateEntity
    :fetch-data-req="reportApi.getCreateTable"
    :save-data-req="reportApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import reportApi from '@/src/utils/api/report'
</script>
