import type {
  ITableColumn,
  ITableFilterValue,
  ITableList,
  ITableRow,
} from '@/src/utils/api/models/infoTable.base'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface IInfoDataTableStore {
  filters: Ref<Record<string, ITableFilterValue>>
  setInitTableData: (
    redirectUrl: string,
    pageSize: number,
    page: number,
    fetchCallback: (
      page: number,
      size: number,
      filters: Record<string, ITableFilterValue>
    ) => Promise<ITableList<ITableRow>>
  ) => void
  getEntityRedirectUrl: (entity: ITableRow) => string
  getTotal: () => number
  getPage: () => number
  getPageSize: () => number
  getMaxPage: () => number
  getColumns: () => ITableColumn[]
  getTableData: () => ITableRow[]
  setPage: (page: number) => Promise<void>
  setPageSize: (size: number) => Promise<void>
  resetPage: () => Promise<void>
  fetchCurrentPage: () => Promise<void>
  fetchPage: () => Promise<void>
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
          filters: Record<string, ITableFilterValue>
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
      filters.value = {}
      tableDataRef.value = []
      tableColumnRef.value = []
      maxPageRef.value = NaN
      totalRef.value = NaN
      pageRef.value = 1
    }

    const initBooleanFilters = (columns: ITableColumn[]) => {
      columns.forEach(column => {
        if (column.type !== 'boolean' || column.filtrable === false || filters.value[column.code])
          return
        filters.value[column.code] = ''
      })
    }

    //   #endregion

    const setInitTableData = (
      redirectUrl: string,
      pageSize: number,
      page: number,
      fetchCallback: (
        page: number,
        size: number,
        filters: Record<string, ITableFilterValue>
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

    const fetchPage = async () => {
      const isValid = isValidPageForFetch()

      if (!isValid) return

      const response = await fetchCallbackRef.value!(
        pageRef.value,
        pageSizeRef.value,
        filters.value
      )

      tableDataRef.value = response.data
      tableColumnRef.value = response.columns
      maxPageRef.value = response.maxPage
      totalRef.value = response.total
      pageRef.value = response.page

      initBooleanFilters(response.columns)
    }

    const setPage = async (page: number) => {
      pageRef.value = page
      await fetchPage()
    }

    const setPageSize = async (size: number) => {
      pageSizeRef.value = size
      pageRef.value = 1
      await fetchPage()
    }

    const resetPage = async () => {
      pageRef.value = 1
      await fetchPage()
    }

    const fetchCurrentPage = async () => {
      await fetchPage()
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
      setPage,
      setPageSize,
      resetPage,
      fetchCurrentPage,
      fetchPage,
    }
  }
)
