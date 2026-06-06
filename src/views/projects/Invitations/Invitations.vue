<template>
  <InfoDataTable
    :redirect-entity-url="'invitations'"
    :fetchDataReq="invitationApi.getTableList"
    :default-page-size="10"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import invitationApi from '@/src/utils/api/invitation'
</script>
