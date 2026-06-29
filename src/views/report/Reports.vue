<template>
  <InfoDataTable
    :redirect-entity-url="'analytics'"
    :fetchDataReq="reportApi.getTableList"
    :default-page-size="10"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import reportApi from '@/src/utils/api/report'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addReport') {
      router.push('analytics/create')
    }
  }
</script>
