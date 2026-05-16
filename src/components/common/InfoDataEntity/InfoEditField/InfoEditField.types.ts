import type { SelectBaseOption } from 'naive-ui/es/select/src/interface'

export type SelectOptionWithPayload = SelectBaseOption & {
  payload: {
    id: number
    code: string
  }
}
