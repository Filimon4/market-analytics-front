import type { SelectOption } from 'naive-ui'

export type SelectResponseItem = {
  id: string
  code: string
  [key: string]: unknown
}

export type SelectOptionWithPayload = SelectOption & {
  value: string
  payload: SelectResponseItem
}
