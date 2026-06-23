<template>
  <div class="entity-wrapper">
    <div class="blocks">
      <StrategySelectionBlock
        :strategies="selectedStrategies"
        :loading="strategiesDetailsLoading"
        @add="openStrategyModal"
        @remove="removeStrategy"
      />

      <CompareTemplateBlock v-if="selectedStrategies.length >= 2" />
    </div>

    <select-list-modal
      v-model:show="showStrategyModal"
      title="Выбрать стратегии"
      confirm-text="Добавить"
      empty-text="Список стратегий пуст"
      :fetch-items="loadStrategies"
      :initial-selected-ids="selectedStrategyIds"
      @confirm="saveSelectedStrategies"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type {
    ISelectListItem,
    SelectListItemId,
  } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import strategyApi from '@/src/utils/api/strategy'
  import CompareTemplateBlock from './components/CompareTemplateBlock.vue'
  import StrategySelectionBlock from './components/StrategySelectionBlock.vue'
  import type { ICompareStrategy } from './types'

  const showStrategyModal = ref(false)
  const strategiesDetailsLoading = ref(false)
  const selectedStrategies = ref<ICompareStrategy[]>([])

  const selectedStrategyIds = computed(() => selectedStrategies.value.map(strategy => strategy.id))

  function loadStrategies() {
    return strategyApi.select()
  }

  async function loadStrategyDetails(strategy: ISelectListItem): Promise<ICompareStrategy> {
    const statistics = await strategyApi.statistics(Number(strategy.id))
    return {
      ...strategy,
      statistics,
    } as ICompareStrategy
  }

  function openStrategyModal() {
    showStrategyModal.value = true
  }

  async function saveSelectedStrategies(items: ISelectListItem[]) {
    strategiesDetailsLoading.value = true
    try {
      selectedStrategies.value = await Promise.all(items.map(loadStrategyDetails))
    } finally {
      strategiesDetailsLoading.value = false
    }
  }

  function removeStrategy(strategyId: SelectListItemId) {
    selectedStrategies.value = selectedStrategies.value.filter(
      strategy => strategy.id !== strategyId
    )
  }
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;
  @use '@/src/components/Layout/InfoDataEntity/styles/InfoDataEntityV2.mixins' as *;

  @include custom-data-entity-v2-children;
  @include custom-data-entities-v2-blocks;
  @include custom-data-entity;
</style>
