<template>
  <InfoDataTable
    :redirect-entity-url="'channelsources'"
    :fetchDataReq="channelSrouceApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'addChannelSource',
        size: 'medium',
        title: 'Добавить',
      },
    ]"
    @click:action="handleClickAction"
  />
</template>

<script setup lang="ts">
  import InfoDataTable from '@/src/components/Layout/InfoDataTable/InfoDataTable.vue'
  import channelSrouceApi from '@/src/utils/api/channelSource'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addChannelSource') {
      router.push('channelsources/create')
    }
  }
</script>
