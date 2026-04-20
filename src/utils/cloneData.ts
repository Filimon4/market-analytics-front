import { isProxy, toRaw } from 'vue'

export const cloneData = (data: object) => {
  if (isProxy(data)) {
    data = toRaw(data)
  }
  if (!data) return new Object()
  return window?.['structuredClone'] ? structuredClone(data) : JSON.parse(JSON.stringify(data))
}
