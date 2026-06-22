<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => userApi.getTableById(userId)"
    :save-data-req="userApi.updateUser"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import userApi from '@/src/utils/api/user/index'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const userId = computed(() => Number(route.params.id))
</script>
