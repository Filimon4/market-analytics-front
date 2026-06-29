<template>
  <InfoDataEntityV2
    :fetch-data-req="async () => reportApi.getTableEntity(id)"
    :save-data-req="reportApi.saveEntity"
    @click:action="handleAction"
  />
</template>

<script setup lang="ts">
  import InfoDataEntityV2 from '@/src/components/Layout/InfoDataEntity/InfoDataEntityV2.vue'
  import reportApi from '@/src/utils/api/report'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const id = computed(() => Number(route.params.id))

  const handleAction = (code: string) => {
    if (code === 'openStrategyReport') {
      router.push(`strategies/${String(id.value)}`)
    }
  }
</script>
