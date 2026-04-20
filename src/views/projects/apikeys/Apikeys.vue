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
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import apiKeysApi from '@/src/utils/api/apikeys'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addApiKey') {
      router.push('apikeys/create')
    }
  }
</script>
