<template>
  <div class="entity-wrapper">
    <div class="blocks">
      <ReportConfigurationBlock v-model:value="reportConfiguration" />

      <SelectionBlock :title="'Выбор стратегий'" :selection-style="true">
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

      <SelectionBlock
        :title="'Выбор каналов'"
        :selection-style="false"
        v-if="selectedStrategies.length >= 2"
      >
        <ChannelColumn
          v-for="strategy in selectedStrategies"
          :strategy="strategy"
          :key="strategy.id"
          :channels="selectedChannels[strategy.id] || []"
          @remove="id => removeChannel(strategy.id, Number(id))"
        >
          <template #add-entity>
            <n-button
              :loading="channelsDetailsLoading"
              :class="'content-add'"
              @click="() => openChannelModal(strategy)"
              dashed
              >+</n-button
            >
          </template>
        </ChannelColumn>
      </SelectionBlock>

      <SelectionBlock
        :title="'Сравнение по свойствам и метрикам'"
        :selection-style="false"
        v-if="Object.values(selectedChannels).every(chnl => chnl.length >= 1)"
      ></SelectionBlock>
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

    <select-list-modal
      v-model:show="showChannelModal"
      title="Выбрать канала трафика"
      confirm-text="Добавить"
      empty-text="Список каналов пуст"
      :fetch-items="loadChannels"
      :initial-selected-ids="selectedChannels[tmpCurrentStrategyId]?.map(ch => ch.id)"
      @confirm="saveSelectedChannels"
      @cancel="() => (tmpCurrentStrategyId = NaN)"
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
  import type { ICompareChannale, ICompareReportConfiguration, ICompareStrategy } from './types.ts'
  import { useMessage, NButton } from 'naive-ui'
  import StrategyColumn from '@/src/views/marketing/strategies/CreateCompareStrategy/components/StrategyColumn.vue'
  import SelectionBlock from '@/src/views/marketing/strategies/CreateCompareStrategy/components/SelectionBlock.vue'
  import ChannelColumn from '@/src/views/marketing/strategies/CreateCompareStrategy/components/ChannelColumn.vue'
  import channelApi from '@/src/utils/api/channel/index.ts'

  const message = useMessage()

  const maxColumns = ref<number>(4)
  const reportConfiguration = ref<ICompareReportConfiguration>({
    period: null,
  })

  // #region Select channel
  const selectedChannels = ref<Record<string, ICompareChannale[]>>({})
  const showChannelModal = ref(false)
  const channelsDetailsLoading = ref(false)
  const tmpCurrentStrategyId = ref()

  function openChannelModal(strategy: ICompareChannale) {
    const channels = selectedChannels.value[strategy.id]

    if (channels && channels.length >= 4) {
      message.warning('Вы не можете выбрать больше 4 каналов')
      return
    }
    tmpCurrentStrategyId.value = strategy.id
    showChannelModal.value = true
  }

  function loadChannels() {
    if (!tmpCurrentStrategyId.value) throw new Error('Cannot fetch channels without strategy id')

    return channelApi.select({
      strategyId: tmpCurrentStrategyId.value,
    })
  }

  async function saveSelectedChannels(items: ISelectListItem[]) {
    if (!tmpCurrentStrategyId.value) throw new Error('Cannot fetch channels without strategy id')

    if (items.length > 4) {
      message.warning('Вы не можете выбрать больше 4 каналов')
      return
    }
    // await refreshSelectedStrategies(items)
    selectedChannels.value = {
      ...selectedChannels.value,
      [tmpCurrentStrategyId.value]: items,
    }
    tmpCurrentStrategyId.value = NaN
    showChannelModal.value = false
  }

  function removeChannel(strategyId: SelectListItemId, id: number) {
    const channels = selectedChannels.value[strategyId] || []
    selectedChannels.value = {
      ...selectedChannels.value,
      [strategyId]: channels?.filter(chnl => chnl.id !== id),
    }
  }
  // #endregion

  // #region Select Strategy
  const selectedStrategies = ref<ICompareStrategy[]>([])
  const strategiesDetailsLoading = ref(false)
  const selectedStrategyIds = computed(() => selectedStrategies.value.map(strategy => strategy.id))

  const showStrategyModal = ref(false)

  function loadStrategies() {
    return strategyApi.select()
  }

  async function saveSelectedStrategies(items: ISelectListItem[]) {
    if (items.length > 4) {
      message.warning('Вы не можете выбрать больше 4 стратегий')
      return
    }
    await refreshSelectedStrategies(items)
    showStrategyModal.value = false
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
    strategiesDetailsLoading.value = true
    try {
      const strategies = await Promise.all(items.map(loadStrategyDetails))
      selectedStrategies.value = strategies
    } finally {
      strategiesDetailsLoading.value = false
    }
  }

  function removeStrategy(strategyId: SelectListItemId) {
    selectedStrategies.value = selectedStrategies.value.filter(
      strategy => strategy.id !== strategyId
    )
    selectedChannels.value = {
      ...selectedChannels.value,
      [strategyId]: [],
    }
  }
  // #endregion

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
