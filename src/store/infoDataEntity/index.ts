import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type { Data } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'

interface IInfoDataEntityStore {
  initialData: Ref<Data>
  currentData: Ref<Data>
  hasChanges: Ref<boolean>
  setData: (data: Data) => void
  resetDataToDefault: () => void
  updateFieldValue: (path: string, value: Data[string]) => void
}

const cloneData = (data: Data): Data => {
  return JSON.parse(JSON.stringify(data)) as Data
}

export const useInfoDataEntityStore = defineStore(
  'useInfoDataEntityStore',
  (): IInfoDataEntityStore => {
    const initialData = ref<Data>({})
    const currentData = ref<Data>({})

    const hasChanges = computed(
      () => JSON.stringify(initialData.value) !== JSON.stringify(currentData.value)
    )

    const setData = (data: Data) => {
      const clonedData = cloneData(data ?? {})
      initialData.value = clonedData
      currentData.value = cloneData(clonedData)
    }

    const resetDataToDefault = () => {
      currentData.value = cloneData(initialData.value)
    }

    const updateFieldValue = (path: string, value: Data[string]) => {
      const keys = path.split('.')
      let target: Record<string, unknown> = currentData.value

      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1
        if (isLast) {
          target[key] = value
          return
        }

        const nextValue = target[key]
        if (typeof nextValue !== 'object' || nextValue === null) {
          target[key] = {}
        }

        target = target[key] as Record<string, unknown>
      })
    }

    return {
      initialData,
      currentData,
      hasChanges,
      setData,
      resetDataToDefault,
      updateFieldValue,
    }
  }
)
