<template>
  <InfoDataEntity
    :fetch-data-req="async () => userApi.getTableById(userId)"
    :save-data-req="async () => true"
  />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import userApi from '@/src/utils/api/user/index'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const userId = computed(() => Number(route.params.id))
</script>
