<template>
  <InfoDataEntity
    :fetch-data-req="async () => invitationApi.getTableEntity(invitationId)"
    :save-data-req="async () => true"
  />
</template>

<script setup lang="ts">
  import InfoDataEntity from '@/src/components/Layout/InfoDataEntity/InfoDataEntity.vue'
  import invitationApi from '@/src/utils/api/invitation'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const invitationId = computed(() => Number(route.params.id))
</script>
