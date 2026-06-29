import type { ITableRow } from './infoTable.base'

export interface IReport extends ITableRow {
  name: string
  slug: string
  dateFrom: string
  dateTo: string
  visibility: string
  createdAt: string
  deleted: boolean
}

export type IReportPick<T extends keyof IReport> = Pick<IReport, T>

export interface IStrategyCompareReportValue {
  id: string
  name: string
  value: number
}

export interface IStrategyCompareReportPeriod {
  startDate: string | null
  endDate: string | null
}

export interface IStrategyCompareReportTotals {
  impressions: number
  clicks: number
  spend: number
  leads: number
}

export interface IStrategyCompareReportEntity {
  id: string
  name: string
}

export interface IStrategyCompareReportRowData {
  uf: IStrategyCompareReportValue[]
  period: IStrategyCompareReportPeriod
  totals: IStrategyCompareReportTotals
  channel: IStrategyCompareReportEntity
  metrics: IStrategyCompareReportValue[]
  strategy: IStrategyCompareReportEntity
}

export interface IStrategyCompareReportRow {
  id: string
  reportResultId: string
  rowIndex: number
  data: IStrategyCompareReportRowData
}

export interface IStrategyCompareReportResult {
  id: string
  reportId: string
  paramsHash: string
  createdAt: string
  expiresAt: string
  isStale: boolean
  rows: IStrategyCompareReportRow[]
}

export interface IStrategyCompareReport {
  id: string
  name: string
  slug: string
  dateFrom: string | null
  dateTo: string | null
  visibility: string
  createdAt: string
  updatedAt: string
  deleted: boolean
  config: {
    type: 'strategyCompare'
    reportConfiguration?: {
      period?: IStrategyCompareReportPeriod
    }
  }
  createdById: string
  projectId: string
  reportResults: IStrategyCompareReportResult[]
}
