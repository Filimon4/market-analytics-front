<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="roleApi.getCreateTable"
    :save-data-req="roleApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import roleApi from '@/src/utils/api/role'
</script>
