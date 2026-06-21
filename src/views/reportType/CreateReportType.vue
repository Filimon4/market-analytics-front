<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="reportTypeApi.getCreateTable"
    :save-data-req="reportTypeApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import reportTypeApi from '@/src/utils/api/reportType'
</script>
