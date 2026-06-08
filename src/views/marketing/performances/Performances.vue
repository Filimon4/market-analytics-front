<template>
  <InfoDataTable
    :redirect-entity-url="'performances'"
    :fetchDataReq="channelPerformanceApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'addPerformance',
        size: 'medium',
        title: 'Добавить',
      },
    ]"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import channelPerformanceApi from '@/src/utils/api/channelPerformance'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addPerformance') {
      router.push('performances/create')
    }
  }
</script>
