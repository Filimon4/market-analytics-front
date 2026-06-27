import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { StageBuilderStage } from '@/src/components/Layout/StageBuilder/types'
import type {
  ISelectListItem,
  SelectListItemId,
} from '@/src/components/Ui/SelectListModal/SelectListModal.types'
import type {
  ICompareReportConfiguration,
  ICompareChannale,
  ICompareStrategy,
  IPeriod,
} from '@/src/views/marketing/strategies/CreateCompareStrategy/types'
import strategyApi from '@/src/utils/api/strategy'

interface ICompareStrategyV2Store {
  currentStage: Ref<string>
  stages: ComputedRef<StageBuilderStage[]>
  maxColumns: Ref<number>
  reportConfiguration: Ref<ICompareReportConfiguration>
  selectedStrategies: Ref<ICompareStrategy[]>
  selectedChannels: Ref<Record<string, ICompareChannale[]>>
  strategiesDetailsLoading: Ref<boolean>
  channelsDetailsLoading: Ref<boolean>

  setReportConfiguration: (configuration: ICompareReportConfiguration) => void
  setReportPeriod: (period: IPeriod | null) => void
  refreshSelectedStrategies: (items: ISelectListItem[]) => Promise<void>
  removeStrategy: (strategyId: SelectListItemId) => void
  setSelectedChannels: (strategyId: SelectListItemId, channels: ICompareChannale[]) => void
  removeChannel: (strategyId: SelectListItemId, channelId: SelectListItemId) => void
  reset: () => void
}

const defaultReportConfiguration = (): ICompareReportConfiguration => ({
  period: null,
})

export const useCompareStrategyV2Store = defineStore(
  'useCompareStrategyV2Store',
  (): ICompareStrategyV2Store => {
    const currentStage = ref('')
    const maxColumns = ref(4)
    const reportConfiguration = ref<ICompareReportConfiguration>(defaultReportConfiguration())
    const selectedStrategies = ref<ICompareStrategy[]>([])
    const selectedChannels = ref<Record<string, ICompareChannale[]>>({})
    const strategiesDetailsLoading = ref(false)
    const channelsDetailsLoading = ref(false)

    const allStrategiesHaveChannels = computed(() => {
      if (selectedStrategies.value.length < 2) return false

      return selectedStrategies.value.every(strategy => {
        const channels = selectedChannels.value[String(strategy.id)] || []
        return channels.length >= 1
      })
    })

    const stages = computed<StageBuilderStage[]>(() => [
      {
        code: 'config',
        title: 'Конфигурация',
        description: 'Конфигурация для сравнения стратегий',
        disableBack: true,
      },
      {
        code: 'strategies',
        title: 'Выбор стратегий',
        description: 'Выберите от 2 до 4 стратегий для сравнения',
        disableNext: selectedStrategies.value.length < 2,
        disableBack: true,
      },
      {
        code: 'channels',
        title: 'Выбор каналов',
        description: 'Выберите от 1 до 4 каналов для каждой стратегии',
        hidden: selectedStrategies.value.length < 2,
        disableNext: !allStrategiesHaveChannels.value,
      },
      {
        code: 'metrics',
        title: 'Сравнение по свойствам и метрикам',
        description: 'Выберите свойства и метрики каналов для сравнения стратегий',
        hidden: !allStrategiesHaveChannels.value,
      },
    ])

    function setReportConfiguration(configuration: ICompareReportConfiguration) {
      reportConfiguration.value = configuration
    }

    function setReportPeriod(period: IPeriod | null) {
      reportConfiguration.value = {
        ...reportConfiguration.value,
        period,
      }
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

    async function refreshSelectedStrategies(items: ISelectListItem[]) {
      strategiesDetailsLoading.value = true
      try {
        selectedStrategies.value = await Promise.all(items.map(loadStrategyDetails))
        console.log(selectedStrategies.value)
        pruneSelectedChannels()
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
        [String(strategyId)]: [],
      }
      pruneSelectedChannels()
    }

    function pruneSelectedChannels() {
      const strategyIds = new Set(selectedStrategies.value.map(strategy => String(strategy.id)))
      selectedChannels.value = Object.fromEntries(
        Object.entries(selectedChannels.value).filter(([strategyId]) => strategyIds.has(strategyId))
      )
    }

    function setSelectedChannels(strategyId: SelectListItemId, channels: ICompareChannale[]) {
      channelsDetailsLoading.value = true
      try {
        selectedChannels.value = {
          ...selectedChannels.value,
          [String(strategyId)]: channels,
        }
      } finally {
        channelsDetailsLoading.value = false
      }
    }

    function removeChannel(strategyId: SelectListItemId, channelId: SelectListItemId) {
      const channels = selectedChannels.value[String(strategyId)] || []
      selectedChannels.value = {
        ...selectedChannels.value,
        [String(strategyId)]: channels.filter(channel => String(channel.id) !== String(channelId)),
      }
    }

    function reset() {
      currentStage.value = ''
      maxColumns.value = 4
      reportConfiguration.value = defaultReportConfiguration()
      selectedStrategies.value = []
      selectedChannels.value = {}
      strategiesDetailsLoading.value = false
      channelsDetailsLoading.value = false
    }

    return {
      currentStage,
      stages,
      maxColumns,
      reportConfiguration,
      selectedStrategies,
      selectedChannels,
      strategiesDetailsLoading,
      channelsDetailsLoading,
      setReportConfiguration,
      setReportPeriod,
      refreshSelectedStrategies,
      removeStrategy,
      setSelectedChannels,
      removeChannel,
      reset,
    }
  }
)
