import { isProxy, toRaw } from 'vue'

export const cloneData = <T>(data: T): T => {
  const isArray = Array.isArray(data)
  let internalData: unknown = data
  if (isProxy(internalData)) {
    internalData = toRaw(internalData)
  }

  if (!internalData) return (isArray ? [] : {}) as T

  if (Array.isArray(internalData)) {
    internalData = internalData.map(item => (isProxy(item) ? toRaw(item) : item))
  } else if (typeof internalData === 'object' && internalData !== null) {
    const copy = { ...(internalData as Record<string, unknown>) }
    for (const key in copy) {
      const value = copy[key]
      if (Array.isArray(value)) {
        copy[key] = value.map(item => (isProxy(item) ? toRaw(item) : item))
      }
    }
    internalData = copy
  }

  return (
    window?.['structuredClone']
      ? structuredClone(internalData)
      : JSON.parse(JSON.stringify(internalData))
  ) as T
}
