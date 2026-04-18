import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type {
  Data,
  IBlockDetail,
  IBlockTreeDetail,
  IEntity,
  IField,
} from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'

interface IInfoDataEntityStore {
  initialData: Ref<Data>
  currentData: Ref<Data>
  blocksData: Ref<IEntity['blocks']>
  blockDetailsData: Ref<IEntity['blockDetails']>
  hasChanges: Ref<boolean>
  setData: (data: IEntity['data']) => void
  getValueOfField: (field: IField) => unknown
  setBlocks: (blocks: IEntity['blocks']) => void
  getColumnsForBlock: (blockCode: string, capacity: number, max: number) => IField[][]
  setBlockDetails: (blockDetails: IEntity['blockDetails']) => void
  getBlockDetails: <T extends IBlockTreeDetail | IBlockDetail>(blockCode: string) => T
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
    const blocksData = ref<IEntity['blocks']>([])
    const blockDetailsData = ref<IEntity['blockDetails']>([])

    const hasChanges = computed(
      () => JSON.stringify(initialData.value) !== JSON.stringify(currentData.value)
    )

    const setData = (data: IEntity['data']) => {
      const clonedData = cloneData(data ?? {})
      initialData.value = clonedData
      currentData.value = cloneData(clonedData)
    }

    const setBlocks = (blocks: IEntity['blocks']) => {
      blocksData.value = blocks
    }

    const getColumnsForBlock = (blockCode: string, capacity: number, max: number) => {
      const fields = getBlockDetails<IBlockDetail>(blockCode).fields
      if (!fields.length) return []

      const columns: Array<typeof fields> = []
      let currentColumn: typeof fields = []

      for (const field of fields) {
        if (currentColumn.length >= capacity) {
          if (columns.length + 1 >= max) break
          columns.push(currentColumn)
          currentColumn = []
        }
        currentColumn.push(field)
      }

      if (currentColumn.length > 0) columns.push(currentColumn)
      return columns
    }

    const setBlockDetails = (blockDetails: IEntity['blockDetails']) => {
      blockDetailsData.value = blockDetails
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

    const getValueOfField = (field: IField) => {
      return (
        field.path
          .split('.')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .reduce((obj: any, key: string) => obj?.[key], currentData.value) as unknown
      )
    }

    const getBlockDetails = <T extends IBlockTreeDetail | IBlockDetail>(blockCode: string): T => {
      return blockDetailsData.value.find(block => block.blockCode === blockCode) as T
    }

    return {
      initialData,
      currentData,
      blocksData,
      blockDetailsData,
      hasChanges,
      setData,
      getValueOfField,
      setBlocks,
      getColumnsForBlock,
      setBlockDetails,
      getBlockDetails,
      resetDataToDefault,
      updateFieldValue,
    }
  }
)
