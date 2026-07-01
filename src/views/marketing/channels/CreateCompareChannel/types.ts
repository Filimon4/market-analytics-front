import type {
  ISelectListItem,
  SelectListItemId,
} from '@/src/components/Ui/SelectListModal/SelectListModal.types'
import strategyApi from '@/src/utils/api/strategy'

export type StrategyStatistics = Awaited<ReturnType<typeof strategyApi.statistics>>

export type ICompareChannale = ISelectListItem

export interface ICompareStrategy extends ISelectListItem {
  id: SelectListItemId
  code?: string
  status?: string
  createdAt?: string
  statistics?: StrategyStatistics
}

export interface IPeriod {
  startDate: string
  endDate: string
}

export interface ICompareReportConfiguration {
  period: IPeriod | null
}
