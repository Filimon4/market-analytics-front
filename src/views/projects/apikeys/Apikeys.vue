<template>
  <InfoDataTable
    :redirect-entity-url="'apikeys'"
    :fetchDataReq="apiKeysApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'addApiKey',
        size: 'medium',
        title: 'Добавить',
      },
    ]"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue'
  import apiKeysApi from '@/src/utils/api/apikeys'
</script>
