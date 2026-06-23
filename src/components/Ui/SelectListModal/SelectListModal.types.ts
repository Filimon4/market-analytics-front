export type SelectListItemId = string | number

export interface ISelectListItem {
  id: SelectListItemId
  code?: string
  description?: string | null
  disabled?: boolean
  [key: string]: unknown
}

export interface ISelectListFetchContext {
  search: string
  filters: Record<string, unknown>
}

export type SelectListFetchParams = Record<string, unknown>

export type SelectListFetchItems<T extends ISelectListItem = ISelectListItem> = (
  params: SelectListFetchParams,
  context: ISelectListFetchContext
) => Promise<T[]>

export type SelectListBuildFetchParams = (context: ISelectListFetchContext) => SelectListFetchParams

export type SelectListFilterItems<T extends ISelectListItem = ISelectListItem> = (
  items: T[],
  context: ISelectListFetchContext
) => T[]
