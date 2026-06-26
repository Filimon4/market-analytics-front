<template>
  <InfoDataCreateEntityV2
    :fetch-data-req="apiKeysApi.getCreateTable"
    :save-data-req="apiKeysApi.createEntity"
  />
</template>

<script setup lang="ts">
  import InfoDataCreateEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataCreateEntityV2.vue'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'
  import apiKeysApi from '@/src/utils/api/apikeys'
  import { onMounted } from 'vue'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  onMounted(() => {
    infoDataEntityStore.setMode('create')
  })
</script>
