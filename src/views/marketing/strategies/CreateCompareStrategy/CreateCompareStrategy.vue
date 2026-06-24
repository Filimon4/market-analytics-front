<template>
  <div class="entity-wrapper">
    <div class="blocks">
      <ReportConfigurationBlock v-model:value="reportConfiguration" />

      <SelectionBlock>
        <StrategyColumn
          v-for="strategy in selectedStrategies"
          :key="strategy.id"
          :strategy="strategy"
          @remove="removeStrategy"
        />

        <template #add-entity>
          <n-button
            :loading="strategiesDetailsLoading"
            :class="'content-add'"
            @click="openStrategyModal"
            dashed
            >+</n-button
          >
        </template>
      </SelectionBlock>

      <SelectionBlock v-if="selectedStrategies.length >= 2"> </SelectionBlock>
    </div>

    <select-list-modal
      v-model:show="showStrategyModal"
      title="Выбрать стратегии"
      confirm-text="Добавить"
      empty-text="Список стратегий пуст"
      :fetch-items="loadStrategies"
      :initial-selected-ids="selectedStrategyIds"
      @confirm="saveSelectedStrategies"
      :close-on-confirm="false"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import SelectListModal from '@/src/components/Ui/SelectListModal/SelectListModal.vue'
  import type {
    ISelectListItem,
    SelectListItemId,
  } from '@/src/components/Ui/SelectListModal/SelectListModal.types'
  import strategyApi from '@/src/utils/api/strategy'
  import ReportConfigurationBlock from './components/ReportConfigurationBlock.vue'
  import type { ICompareReportConfiguration, ICompareStrategy } from './types.ts'
  import { useMessage, NButton } from 'naive-ui'
  import ChannelSelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/ChannelSelectionBlock.vue'
  import StrategyColumn from '@/src/views/marketing/strategies/CreateCompareStrategy/components/StrategyColumn.vue'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'

  const message = useMessage()

  const maxColumns = ref<number>(4)
  const showStrategyModal = ref(false)
  const strategiesDetailsLoading = ref(false)
  const selectedStrategies = ref<ICompareStrategy[]>([])
  const reportConfiguration = ref<ICompareReportConfiguration>({
    period: null,
  })
  const strategyDetailsRequestId = ref(0)

  const selectedStrategyIds = computed(() => selectedStrategies.value.map(strategy => strategy.id))

  function loadStrategies() {
    return strategyApi.select()
  }

  async function loadStrategyDetails(strategy: ISelectListItem): Promise<ICompareStrategy> {
    const options: {
      from?: Date
      to?: Date
    } = {}

    if (reportConfiguration.value.period?.endDate) {
      options.to = new Date(reportConfiguration.value.period.endDate)
    }

    if (reportConfiguration.value.period?.startDate) {
      options.from = new Date(reportConfiguration.value.period.startDate)
    }

    const statistics = await strategyApi.statistics(Number(strategy.id), options)
    return {
      ...strategy,
      statistics,
    } as ICompareStrategy
  }

  function openStrategyModal() {
    if (selectedStrategies.value.length >= 4) {
      message.warning('Вы не можете выбрать больше 4 стратегий')
      return
    }
    showStrategyModal.value = true
  }

  async function refreshSelectedStrategies(items: ISelectListItem[]) {
    const currentRequestId = ++strategyDetailsRequestId.value

    strategiesDetailsLoading.value = true
    try {
      const strategies = await Promise.all(items.map(loadStrategyDetails))

      if (currentRequestId !== strategyDetailsRequestId.value) return

      selectedStrategies.value = strategies
    } finally {
      if (currentRequestId === strategyDetailsRequestId.value) {
        strategiesDetailsLoading.value = false
      }
    }
  }

  async function saveSelectedStrategies(items: ISelectListItem[]) {
    if (items.length > 4) {
      message.warning('Вы не можете выбрать больше 4 стратегий')
      return
    }
    await refreshSelectedStrategies(items)
    showStrategyModal.value = false
  }

  function removeStrategy(strategyId: SelectListItemId) {
    selectedStrategies.value = selectedStrategies.value.filter(
      strategy => strategy.id !== strategyId
    )
  }

  watch(
    reportConfiguration,
    async () => {
      if (!selectedStrategies.value.length) return

      await refreshSelectedStrategies(selectedStrategies.value)
    },
    { deep: true }
  )
</script>

<style scoped lang="scss">
  @use '@/src/components/Layout/CustomDataEntityV2/styles/customDataEntityV2.mixins' as *;
  @use '@/src/components/Layout/InfoDataEntity/styles/InfoDataEntityV2.mixins' as *;

  @include custom-data-entity-v2-children;
  @include custom-data-entities-v2-blocks;
  @include custom-data-entity;

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
