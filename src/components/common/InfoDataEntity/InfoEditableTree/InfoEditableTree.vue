<template>
  <Tree
    v-if="loaded"
    v-model:value="localValue"
    :cascade="options.cascade"
    :checkable="options.checkable"
  />
</template>

<script setup lang="ts">
  import type {
    IBlock,
    IBlockTreeDetail,
  } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import { onMounted, ref } from 'vue'
  import Tree from '@/src/components/Ui/Tree/Tree.vue'
  import type { TreeNodes } from '@/src/components/Ui/Tree/types'

  const infoDataEntityStore = useInfoDataEntityStore()

  const props = defineProps<{
    block: IBlock
    blockDetails: IBlockTreeDetail
  }>()

  const loaded = ref<boolean>(false)
  const localValue = ref<TreeNodes>([])
  const options = ref<{ cascade?: boolean; checkable?: boolean }>({})

  onMounted(() => {
    const nodes = infoDataEntityStore.getTreeNodes(props.blockDetails)
    localValue.value = nodes['nodes']
    options.value = {
      cascade: nodes.cascade,
      checkable: nodes.checkable,
    }
    loaded.value = true
  })
</script>
