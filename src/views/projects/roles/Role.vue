<template>
  <InfoDataEntity :fetch-data-req="async () => roleApi.getTableById(roleId)" />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/layout/InfoDataEntity/InfoDataEntity.vue'
  import roleApi from '@/src/utils/api/role'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const roleId = computed(() => Number(route.params.id))
</script>
