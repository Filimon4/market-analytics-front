<template>
  <!-- TODO: Add "add role button" -->
  <InfoDataTable
    :redirect-entity-url="'roles'"
    :fetchDataReq="roleApi.getTableList"
    :default-page-size="10"
  />
</template>

<script setup lang="ts">
import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue'
import roleApi from '@/src/utils/api/role'
</script>
