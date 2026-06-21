<template>
  <InfoDataTable
    :redirect-entity-url="'report-types'"
    :fetchDataReq="reportTypeApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'addReportType',
        size: 'medium',
        title: 'Добавить',
      },
    ]"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import reportTypeApi from '@/src/utils/api/reportType'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addReportType') {
      router.push('report-types/create')
    }
  }
</script>
