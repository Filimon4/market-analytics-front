<template>
  <InfoDataTable
    :redirect-entity-url="'channels'"
    :fetchDataReq="channelApi.getTableList"
    :default-page-size="10"
    :actions="[
      {
        code: 'compareChannels', // TODO: Добавить логику
        size: 'medium',
        title: 'Сравнить каналы трафика',
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
  import channelApi from '@/src/utils/api/channel'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const handleClickAction = (code: string) => {
    if (code == 'addStrategy') {
      router.push('channels/create')
    } else if (code === 'compareChannels') {
      router.push('/marketing/channels/compare/create')
    }
  }
</script>
