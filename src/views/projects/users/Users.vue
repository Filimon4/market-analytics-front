<template>
  <InfoDataTable
    :redirect-entity-url="'users'"
    :fetchDataReq="userApi.getTableList"
    :default-page-size="10"
  />
</template>

<script setup>
import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue';
import userApi from '@/src/utils/api/user';
</script>
