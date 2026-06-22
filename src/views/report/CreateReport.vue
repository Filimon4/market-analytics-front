<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="reportApi.getCreateTable"
    :save-data-req="reportApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import reportApi from '@/src/utils/api/report'
</script>
