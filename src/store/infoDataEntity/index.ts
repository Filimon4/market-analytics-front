import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type {
  Data,
  IBlockDetail,
  IBlockTreeDetail,
  IEntity,
  IField,
} from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
import { cloneData } from '@/src/utils/cloneData'

interface IInfoDataEntityStore {
  initialData: Ref<Data>
  currentData: Ref<Data>
  blocksData: Ref<IEntity['blocks']>
  blockDetailsData: Ref<IEntity['blockDetails']>
  hasChanges: Ref<boolean>

  // work with currentData
  setData: (data: IEntity['data']) => void
  getValueOfField: (field: IField, isInit?: boolean) => unknown
  setBlocks: (blocks: IEntity['blocks']) => void
  getColumnsForBlock: (blockCode: string, capacity: number, max: number) => IField[][]
  setBlockDetails: (blockDetails: IEntity['blockDetails']) => void
  getBlockDetails: <T extends IBlockTreeDetail | IBlockDetail>(blockCode: string) => T
  updateFieldValue: (path: string, value: Data[string]) => void

  // work with initData
  resetData: () => void
  resetFieldValue: (field: IField) => unknown
  isFieldDiffFromDefault: (field: IField) => boolean
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
      initialData.value = cloneData(data)
      currentData.value = cloneData(data)
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

    const getValueOfField = (field: IField, isInit = false) => {
      return field.path.split('.').reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: any, key: string) => obj?.[key],
        !isInit ? currentData.value : initialData.value
      ) as unknown
    }

    const getBlockDetails = <T extends IBlockTreeDetail | IBlockDetail>(blockCode: string): T => {
      return blockDetailsData.value.find(block => block.blockCode === blockCode) as T
    }

    const resetData = () => {
      currentData.value = cloneData(initialData.value)
    }

    const resetFieldValue = (field: IField) => {
      const initKey = field.path.split('.')[0]
      if (!initKey) throw new Error(`There is no init key in field: ${JSON.stringify(field)}`)
      currentData.value[initKey] = initialData.value[initKey]
      return getValueOfField(field)
    }

    const isFieldDiffFromDefault = (field: IField) => {
      const initKey = field.path.split('.')[0]
      if (!initKey) throw new Error(`There is no init key in field: ${JSON.stringify(field)}`)
      if (getValueOfField(field) != getValueOfField(field, true)) return true
      return false
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
      updateFieldValue,
      resetData,
      resetFieldValue,
      isFieldDiffFromDefault,
    }
  }
)
