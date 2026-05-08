import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'
import type {
  Data,
  IBlockDetail,
  IBlockTreeDetail,
  IEntity,
  IField,
  Tree,
} from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
import { cloneData } from '@/src/utils/cloneData'
import { v4 as uuidv4 } from 'uuid'

interface IInfoDataEntityStore {
  initialData: Ref<Data>
  currentData: Ref<Data>
  blocksData: Ref<IEntity['blocks']>
  blockDetailsData: Ref<IEntity['blockDetails']>
  hasChanges: Ref<boolean>

  // cancelation logic
  cancelationToken: Ref<string>
  getCancelationToken: () => string

  // work with currentData
  setData: (data: IEntity['data']) => void
  getValueOfField: (field: IField, isInit?: boolean) => unknown
  setBlocks: (blocks: IEntity['blocks']) => void
  getColumnsForBlock: (blockCode: string, capacity: number, max: number) => IField[][]
  setBlockDetails: (blockDetails: IEntity['blockDetails']) => void
  getBlockDetails: <T extends IBlockTreeDetail | IBlockDetail>(blockCode: string) => T
  updateFieldValue: (path: string, value: Data[string]) => void

  // work with tree
  getTreeNodes: (blockTree: IBlockTreeDetail) => Tree

  // work with initData
  resetData: () => void
  resetFieldValue: (field: IField) => unknown
  isFieldDiffFromDefault: (field: IField) => boolean

  // save logic
  getSaveData: () => IEntity['data']
}

export const useInfoDataEntityStore = defineStore(
  'useInfoDataEntityStore',
  (): IInfoDataEntityStore => {
    const initialData = ref<Data>({})
    const currentData = ref<Data>({})
    const blocksData = ref<IEntity['blocks']>([])
    const blockDetailsData = ref<IEntity['blockDetails']>([])

    const hasChanges = ref<boolean>(false)

    const cancelationToken = ref<string>(uuidv4())

    const getCancelationToken = () => {
      return cancelationToken.value
    }

    watch(
      () => JSON.stringify(currentData.value),
      value => {
        hasChanges.value = JSON.stringify(initialData.value) !== value
      }
    )

    const setData = (data: IEntity['data']) => {
      initialData.value = cloneData(data)
      currentData.value = cloneData(data)
      hasChanges.value = false
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
      cancelationToken.value = uuidv4()
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

    const getTreeNodes = (blockTree: IBlockTreeDetail) => {
      return blockTree.treePath.split('.').reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: any, key: string) => obj?.[key],
        currentData.value
      ) as Tree
    }

    const getSaveData = () => {
      const saveData = cloneData(currentData.value)

      const treeBlockType = blocksData.value.find(block => block.blockType === 'tree')

      if (treeBlockType) {
        const block = getBlockDetails<IBlockTreeDetail>(treeBlockType.code)

        saveData[block.treePath] = getTreeNodes(block).nodes
      }

      return saveData
    }

    return {
      initialData,
      currentData,
      blocksData,
      blockDetailsData,
      hasChanges,
      cancelationToken,
      getCancelationToken,
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
      getTreeNodes,
      getSaveData,
    }
  }
)
