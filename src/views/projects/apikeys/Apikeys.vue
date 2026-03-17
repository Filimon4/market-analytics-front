<template>
  <InfoDataTable
    :redirect-entity-url="'apikeys'"
    :fetchDataReq="apiKeysApi.getTableList"
    :default-page-size="10"
  />
</template>

<script setup>
import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue';
import apiKeysApi from '@/src/utils/api/apikeys';
</script>
