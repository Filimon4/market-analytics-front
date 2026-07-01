import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { StageBuilderStage } from '@/src/components/Layout/StageBuilder/types'
import type {
  ISelectListItem,
  SelectListItemId,
} from '@/src/components/Ui/SelectListModal/SelectListModal.types'
import channelApi, { type ICreateCompareChannelReportDto } from '@/src/utils/api/channel'
import type {
  ICompareReportConfiguration,
  ICompareStrategy,
  IPeriod,
} from '@/src/views/marketing/channels/CreateCompareChannel/types'

export type CompareChannelMetricEntityType = 'metric' | 'uf'
export type CompareChannelMetricEntityKey = `${CompareChannelMetricEntityType}:${string}`

export interface ISelectedCompareChannelMetricEntities {
  metricIds: string[]
  ufIds: string[]
}

export type ICompareChannel = ISelectListItem

interface ICompareChannelStore {
  reportConfiguration: Ref<ICompareReportConfiguration>
  setReportConfiguration: (configuration: ICompareReportConfiguration) => void
  setReportPeriod: (period: IPeriod | null) => void

  currentStage: Ref<string>
  stages: ComputedRef<StageBuilderStage[]>
  maxColumns: Ref<number>
  selectedStrategy: Ref<ICompareStrategy | null>
  selectedChannels: Ref<ICompareChannel[]>
  selectedMetricEntities: Ref<Record<string, ISelectedCompareChannelMetricEntities>>
  reportCreating: Ref<boolean>

  setSelectedStrategy: (strategy: ICompareStrategy | null) => void
  removeStrategy: () => void
  setSelectedChannels: (channels: ICompareChannel[]) => void
  removeChannel: (channelId: SelectListItemId) => void
  setSelectedMetricEntityKeys: (
    channelId: SelectListItemId,
    keys: CompareChannelMetricEntityKey[]
  ) => void
  buildCreateReportPayload: () => ICreateCompareChannelReportDto
  createReport: () => Promise<unknown>
  reset: () => void
}

const defaultReportConfiguration = (): ICompareReportConfiguration => ({
  period: null,
})

export const useCompareChannelStore = defineStore(
  'useCompareChannelStore',
  (): ICompareChannelStore => {
    const reportConfiguration = ref<ICompareReportConfiguration>(defaultReportConfiguration())

    function setReportConfiguration(configuration: ICompareReportConfiguration) {
      reportConfiguration.value = configuration
    }

    function setReportPeriod(period: IPeriod | null) {
      reportConfiguration.value = {
        ...reportConfiguration.value,
        period,
      }
    }

    const currentStage = ref('')
    const maxColumns = ref(4)
    const selectedStrategy = ref<ICompareStrategy | null>(null)
    const selectedChannels = ref<ICompareChannel[]>([])
    const selectedMetricEntities = ref<Record<string, ISelectedCompareChannelMetricEntities>>({})
    const reportCreating = ref(false)

    const hasEnoughChannels = computed(() => selectedChannels.value.length >= 2)

    const stages = computed<StageBuilderStage[]>(() => [
      {
        code: 'config',
        title: 'Конфигурация',
        description: 'Конфигурация для сравнения стратегий',
        disableBack: true,
      },
      {
        code: 'strategy',
        title: 'Выбор стратегии',
        description: 'Выберите одну стратегию',
        disableBack: true,
        disableNext: !selectedStrategy.value || !hasEnoughChannels.value,
      },
      {
        code: 'channels',
        title: 'Выбор каналов',
        description: 'Выберите одну стратегию и 2 или больше каналов для сравнения',
        disableBack: false,
        disableNext: !selectedStrategy.value || !hasEnoughChannels.value,
      },
      {
        code: 'metrics',
        title: 'Сравнение по свойствам и метрикам',
        description: 'Выберите свойства и метрики каналов для сравнения',
        hidden: !hasEnoughChannels.value,
      },
    ])

    function setSelectedStrategy(strategy: ICompareStrategy | null) {
      const strategyChanged =
        String(selectedStrategy.value?.id ?? '') !== String(strategy?.id ?? '')
      selectedStrategy.value = strategy

      if (strategyChanged) {
        selectedChannels.value = []
        selectedMetricEntities.value = {}
      }
    }

    function removeStrategy() {
      selectedStrategy.value = null
    }

    function setSelectedChannels(channels: ICompareChannel[]) {
      selectedChannels.value = channels
      pruneSelectedMetricEntities()
    }

    function removeChannel(channelId: SelectListItemId) {
      selectedChannels.value = selectedChannels.value.filter(
        channel => String(channel.id) !== String(channelId)
      )
      pruneSelectedMetricEntities()
    }

    function pruneSelectedMetricEntities() {
      const channelIds = new Set(selectedChannels.value.map(channel => String(channel.id)))

      selectedMetricEntities.value = Object.fromEntries(
        Object.entries(selectedMetricEntities.value).filter(([channelId]) =>
          channelIds.has(channelId)
        )
      )
    }

    function setSelectedMetricEntityKeys(
      channelId: SelectListItemId,
      keys: CompareChannelMetricEntityKey[]
    ) {
      const nextValue: ISelectedCompareChannelMetricEntities = {
        metricIds: [],
        ufIds: [],
      }

      for (const key of keys) {
        const [type, id] = key.split(':') as [CompareChannelMetricEntityType, string]

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

    function buildCreateReportPayload(): ICreateCompareChannelReportDto {
      if (!selectedStrategy.value) {
        throw new Error('Cannot create compare channel report without strategy')
      }

      return {
        strategyId: Number(selectedStrategy.value.id),
        channelIds: selectedChannels.value.map(channel => Number(channel.id)),
        channels: selectedChannels.value.map(channel => {
          const selectedEntities = selectedMetricEntities.value[String(channel.id)]

          return {
            channelId: Number(channel.id),
            metricIds: selectedEntities?.metricIds || [],
            ufIds: selectedEntities?.ufIds || [],
          }
        }),
      }
    }

    async function createReport() {
      reportCreating.value = true

      try {
        const result = await channelApi.createCompareReport(buildCreateReportPayload())
        reset()
        return result
      } finally {
        reportCreating.value = false
      }
    }

    function reset() {
      currentStage.value = ''
      maxColumns.value = 4
      selectedStrategy.value = null
      selectedChannels.value = []
      selectedMetricEntities.value = {}
      reportCreating.value = false
    }

    return {
      reportConfiguration,
      setReportConfiguration,
      setReportPeriod,

      currentStage,
      stages,
      maxColumns,
      selectedStrategy,
      selectedChannels,
      selectedMetricEntities,
      reportCreating,
      setSelectedStrategy,
      removeStrategy,
      setSelectedChannels,
      removeChannel,
      setSelectedMetricEntityKeys,
      buildCreateReportPayload,
      createReport,
      reset,
    }
  }
)
