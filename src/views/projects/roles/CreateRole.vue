<template>
  <InfoDataCreateEntity
    :fetch-data-req="roleApi.getCreateTable"
    :save-data-req="roleApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import roleApi from '@/src/utils/api/role'
</script>
