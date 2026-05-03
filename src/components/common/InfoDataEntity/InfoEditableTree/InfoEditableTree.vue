<template>
  <div v-if="localValue?.nodes.length">
    <n-tree
      :data="localValue?.nodes"
      :checkable="localValue?.checkable"
      :draggable="localValue?.draggable"
      :cascade="localValue?.cascade"
      :default-checked-keys="localValue?.defaultCheckedKeys"
      @update:checked-keys="updateCheckedKeys"
    />
  </div>
</template>

<script setup lang="ts">
  import type {
    IBlock,
    IBlockTreeDetail,
    Tree,
  } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import { onMounted, ref } from 'vue'
  import { NTree } from 'naive-ui'
  import { cloneData } from '@/src/utils/cloneData'
  import { watch } from 'vue'

  const infoDataEntityStore = useInfoDataEntityStore()

  const props = defineProps<{
    block: IBlock
    blockDetails: IBlockTreeDetail
  }>()

  const localValue = ref<Tree>()

  onMounted(() => {
    const nodes = infoDataEntityStore.getTreeNodes(props.blockDetails)
    localValue.value = nodes
  })

  const updateCheckedKeys = (defaultCheckedKeys: Array<string & number>) => {
    const newValue = cloneData(localValue.value!) as Tree
    newValue.defaultCheckedKeys = defaultCheckedKeys
    localValue.value = newValue
    infoDataEntityStore.updateFieldValue(props.blockDetails.treePath, localValue)
  }

  watch(
    () => JSON.stringify(infoDataEntityStore.getTreeNodes(props.blockDetails)),
    () => {
      console.log('changes: ')
      const nodes = infoDataEntityStore.getTreeNodes(props.blockDetails)
      localValue.value = nodes
    }
  )
</script>
