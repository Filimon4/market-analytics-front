import type { ITableColumn, ITableList, ITableRow } from '@/src/utils/api/models/infoTable.base'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface IInfoDataTableStore {
  filters: Ref<Record<string, string | number>>
  setInitTableData: (
    redirectUrl: string,
    pageSize: number,
    page: number,
    fetchCallback: (
      page: number,
      size: number,
      filters: Record<string, string | number>
    ) => Promise<ITableList<ITableRow>>
  ) => void
  getEntityRedirectUrl: (entity: ITableRow) => string
  getTotal: () => number
  getPage: () => number
  getPageSize: () => number
  getMaxPage: () => number
  getColumns: () => ITableColumn[]
  getTableData: () => ITableRow[]
  fetchPage: (next?: boolean) => void
}

export const useInfoDataTableStore = defineStore(
  'useInfoDataTableStroe',
  (): IInfoDataTableStore => {
    const filters: IInfoDataTableStore['filters'] = ref({})
    const tableDataRef = ref<ITableRow[]>([])
    const tableColumnRef = ref<ITableColumn[]>([])
    const maxPageRef = ref<number>(NaN)
    const totalRef = ref<number>(NaN)

    const fetchCallbackRef =
      ref<
        (
          page: number,
          size: number,
          filters: Record<string, string | number>
        ) => Promise<ITableList<ITableRow>>
      >()
    const entityRedirectUrlRef = ref<string>()
    const pageRef = ref<number>(NaN)
    const pageSizeRef = ref<number>(NaN)

    // #region Private

    const isValidPageForFetch = () => {
      if (!fetchCallbackRef.value) throw new Error('There is no fetchCallbackRef')
      if (!entityRedirectUrlRef.value) throw new Error('There is no entityRedirectUrlRef')
      if (!pageRef.value) throw new Error('There is no pageRef')
      if (!pageSizeRef.value) throw new Error('There is no pageSizeRef')

      if (maxPageRef.value && pageRef.value > maxPageRef.value)
        throw new Error('There is no maxPageRef or this is last page')

      return true
    }

    const resetTableData = () => {
      tableDataRef.value = []
      pageRef.value = 1
    }

    //   #endregion

    const setInitTableData = (
      redirectUrl: string,
      pageSize: number,
      page: number,
      fetchCallback: (
        page: number,
        size: number,
        filters: Record<string, string | number>
      ) => Promise<ITableList<ITableRow>>
    ) => {
      resetTableData()
      fetchCallbackRef.value = fetchCallback
      entityRedirectUrlRef.value = redirectUrl
      pageSizeRef.value = pageSize
      pageRef.value = page
    }

    const getTotal = () => {
      return totalRef.value
    }

    const getPage = () => {
      return pageRef.value
    }

    const getPageSize = () => {
      return pageSizeRef.value
    }

    const getMaxPage = () => {
      return maxPageRef.value
    }

    const getTableData = () => {
      return tableDataRef.value
    }

    const getColumns = (): ITableColumn[] => {
      return tableColumnRef.value
    }

    const getEntityRedirectUrl = (entity: ITableRow): string => {
      return `${entityRedirectUrlRef.value}/${entity.id}`
    }

    const fetchPage = async (next: boolean = false) => {
      const isValid = isValidPageForFetch()

      if (!isValid) return

      const page = next ? pageRef.value + 1 : pageRef.value

      const response = await fetchCallbackRef.value!(page, pageSizeRef.value, filters.value)

      tableDataRef.value = response.data
      tableColumnRef.value = response.columns
      maxPageRef.value = response.maxPage
      totalRef.value = response.total
      pageRef.value = response.page
    }

    return {
      filters,
      setInitTableData,
      getEntityRedirectUrl,
      getTotal,
      getPage,
      getPageSize,
      getTableData,
      getColumns,
      getMaxPage,
      fetchPage,
    }
  }
)
