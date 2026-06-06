<template>
  <InfoDataTable
    :redirect-entity-url="'strategies'"
    :fetchDataReq="strategyApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'compareStrategy', // TODO: Доделать кнопу
        size: 'medium',
        title: 'Сравнить стратегии',
      },
      {
        code: 'addStrategy',
        size: 'medium',
        title: 'Добавить',
      },
    ]"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import strategyApi from '@/src/utils/api/strategy'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addStrategy') {
      router.push('strategies/create')
    } else if (code === 'compareStrategy') {
    }
  }
</script>
