<template>
  <InfoDataCreateEntity :fetch-data-req="roleApi.getCreateTable" />
</template>

<script setup lang="ts">
  import InfoDataCreateEntity from '@/src/components/layout/InfoDataEntity/InfoDataCreateEntity.vue'
  import roleApi from '@/src/utils/api/role'
</script>
