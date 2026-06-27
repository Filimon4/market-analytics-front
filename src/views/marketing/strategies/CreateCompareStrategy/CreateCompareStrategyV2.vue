<template>
  <div class="entity-wrapper">
    <StageBuilder v-model:current-stage="currentStage" :stages="stages" :show-progress="false">
      <template #config>
        <ReportConfigurationBlockV2 />
      </template>

      <template #strategies>
        <StrategySelectionBlockV2 />
      </template>

      <template #channels>
        <ChannelSelectionBlockV2 />
      </template>

      <template #metrics>
        <MetricsSelectionBlockV2 />
      </template>
    </StageBuilder>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import StageBuilder from '@/src/components/Layout/StageBuilder/StageBuilder.vue'
  import { useCompareStrategyV2Store } from '@/src/store/compareStrategyV2'
  import ChannelSelectionBlockV2 from '@/src/views/marketing/strategies/CreateCompareStrategy/stages/ChannelSelectionBlockV2.vue'
  import MetricsSelectionBlockV2 from '@/src/views/marketing/strategies/CreateCompareStrategy/stages/MetricsSelectionBlockV2.vue'
  import StrategySelectionBlockV2 from '@/src/views/marketing/strategies/CreateCompareStrategy/stages/StrategySelectionBlockV2.vue'
  import ReportConfigurationBlockV2 from '@/src/views/marketing/strategies/CreateCompareStrategy/stages/ReportConfigurationBlockV2.vue'

  const compareStrategyV2Store = useCompareStrategyV2Store()
  const { currentStage, stages, maxColumns } = storeToRefs(compareStrategyV2Store)
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;

  @include custom-data-entity-v2-children;
  @include custom-data-entities-v2-blocks;

  .entity-wrapper {
    width: 100%;
    position: relative;
    padding: 10px;
  }

  :deep(.block-content-selection) {
    flex-direction: column !important;
    align-items: center;
    justify-content: end;
    gap: 10px;
  }

  :deep(.content-columns) {
    display: grid;
    grid-template-columns: repeat(v-bind('maxColumns'), 1fr);
    grid-template-rows: 1fr;
    width: 100%;
  }

  :deep(.content-add) {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
