<template>
  <SelectionBlock :title="'Сравнение по свойствам и метрикам'" :selection-style="false">
    <UfAndMetricsColumn
      v-for="strategy in selectedStrategies"
      :key="strategy.id"
      :channels="selectedChannels[String(strategy.id)] || []"
    />
  </SelectionBlock>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'
  import UfAndMetricsColumn from '@/src/views/marketing/strategies/CreateCompareStrategy/components/UfAndMetricsColumn.vue'
  import { useCompareStrategyV2Store } from '@/src/store/compareStrategyV2'

  const compareStrategyV2Store = useCompareStrategyV2Store()
  const { selectedStrategies, selectedChannels } = storeToRefs(compareStrategyV2Store)
</script>
