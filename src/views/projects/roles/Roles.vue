<template>
  <InfoDataTable
  />
</template>

<script setup>
import InfoDataTable from '@/src/components/layout/InfoDataTable/InfoDataTable.vue'
import roleApi from '@/src/utils/api/role'
import { ref } from 'vue'

const fetchData = async (page, pageSize, filters) => {
  const params = {
    page,
    pageSize,
    ...filters
  }

  await new Promise((res) => setTimeout(() => res(), 1_000))

  const data = await roleApi.getTableList(page, pageSize, filters)

  return data.data.result
}
</script>
