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
import strategyApi, { type ICreateCompareStrategyReportDto } from '@/src/utils/api/strategy'

export type CompareMetricEntityType = 'metric' | 'uf'
export type CompareMetricEntityKey = `${CompareMetricEntityType}:${string}`

export interface ISelectedCompareMetricEntities {
  metricIds: string[]
  ufIds: string[]
}

interface ICompareStrategyV2Store {
  currentStage: Ref<string>
  stages: ComputedRef<StageBuilderStage[]>
  maxColumns: Ref<number>
  reportConfiguration: Ref<ICompareReportConfiguration>
  selectedStrategies: Ref<ICompareStrategy[]>
  selectedChannels: Ref<Record<string, ICompareChannale[]>>
  selectedMetricEntities: Ref<Record<string, ISelectedCompareMetricEntities>>
  strategiesDetailsLoading: Ref<boolean>
  channelsDetailsLoading: Ref<boolean>
  reportCreating: Ref<boolean>

  setReportConfiguration: (configuration: ICompareReportConfiguration) => void
  setReportPeriod: (period: IPeriod | null) => void
  buildCreateReportPayload: () => ICreateCompareStrategyReportDto
  createReport: () => Promise<unknown>
  refreshSelectedStrategies: (items: ISelectListItem[]) => Promise<void>
  removeStrategy: (strategyId: SelectListItemId) => void
  setSelectedChannels: (strategyId: SelectListItemId, channels: ICompareChannale[]) => void
  removeChannel: (strategyId: SelectListItemId, channelId: SelectListItemId) => void
  setSelectedMetricEntityKeys: (channelId: SelectListItemId, keys: CompareMetricEntityKey[]) => void
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
    const selectedMetricEntities = ref<Record<string, ISelectedCompareMetricEntities>>({})
    const strategiesDetailsLoading = ref(false)
    const channelsDetailsLoading = ref(false)
    const reportCreating = ref(false)

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

    function buildCreateReportPayload(): ICreateCompareStrategyReportDto {
      return {
        reportConfiguration: reportConfiguration.value,
        strategies: selectedStrategies.value.map(strategy => {
          const channels = selectedChannels.value[String(strategy.id)] || []

          return {
            strategyId: Number(strategy.id),
            channelIds: channels.map(channel => Number(channel.id)),
            channels: channels.map(channel => {
              const selectedEntities = selectedMetricEntities.value[String(channel.id)]

              return {
                channelId: Number(channel.id),
                metricIds: selectedEntities?.metricIds || [],
                ufIds: selectedEntities?.ufIds || [],
              }
            }),
          }
        }),
      }
    }

    async function createReport() {
      reportCreating.value = true

      try {
        return await strategyApi.createCompareReport(buildCreateReportPayload())
      } finally {
        reportCreating.value = false
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
      pruneSelectedMetricEntities()
    }

    function setSelectedChannels(strategyId: SelectListItemId, channels: ICompareChannale[]) {
      channelsDetailsLoading.value = true
      try {
        selectedChannels.value = {
          ...selectedChannels.value,
          [String(strategyId)]: channels,
        }
        pruneSelectedMetricEntities()
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
      pruneSelectedMetricEntities()
    }

    function pruneSelectedMetricEntities() {
      const channelIds = new Set(
        Object.values(selectedChannels.value)
          .flat()
          .map(channel => String(channel.id))
      )

      selectedMetricEntities.value = Object.fromEntries(
        Object.entries(selectedMetricEntities.value).filter(([channelId]) =>
          channelIds.has(channelId)
        )
      )
    }

    function setSelectedMetricEntityKeys(
      channelId: SelectListItemId,
      keys: CompareMetricEntityKey[]
    ) {
      const nextValue: ISelectedCompareMetricEntities = {
        metricIds: [],
        ufIds: [],
      }

      for (const key of keys) {
        const [type, id] = key.split(':') as [CompareMetricEntityType, string]

        if (type === 'metric') {
          nextValue.metricIds.push(id)
          continue
        }

        nextValue.ufIds.push(id)
      }

      selectedMetricEntities.value = {
        ...selectedMetricEntities.value,
        [String(channelId)]: nextValue,
      }
    }

    function reset() {
      currentStage.value = ''
      maxColumns.value = 4
      reportConfiguration.value = defaultReportConfiguration()
      selectedStrategies.value = []
      selectedChannels.value = {}
      selectedMetricEntities.value = {}
      strategiesDetailsLoading.value = false
      channelsDetailsLoading.value = false
      reportCreating.value = false
    }

    return {
      currentStage,
      stages,
      maxColumns,
      reportConfiguration,
      selectedStrategies,
      selectedChannels,
      selectedMetricEntities,
      strategiesDetailsLoading,
      channelsDetailsLoading,
      reportCreating,
      setReportConfiguration,
      setReportPeriod,
      buildCreateReportPayload,
      createReport,
      refreshSelectedStrategies,
      removeStrategy,
      setSelectedChannels,
      removeChannel,
      setSelectedMetricEntityKeys,
      reset,
    }
  }
)
