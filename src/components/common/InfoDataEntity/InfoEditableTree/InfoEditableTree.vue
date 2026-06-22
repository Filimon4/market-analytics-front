<template>
  <Tree
    v-if="loaded"
    v-model:value="localValue"
    :cascade="options.cascade"
    :checkable="options.checkable"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import Tree from '@/src/components/Ui/Tree/Tree.vue'
  import type { TreeNodes } from '@/src/components/Ui/Tree/types'
  import type { ITreeBlock, ITreeBlockDetail } from '@/src/utils/api/models/infoEntityV2.base'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const props = defineProps<{
    block: ITreeBlock
    blockDetails: ITreeBlockDetail
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

  watch(
    () => infoDataEntityStore.getCancelationToken(),
    () => {
      const nodes = infoDataEntityStore.getTreeNodes(props.blockDetails)
      localValue.value = nodes['nodes']
    }
  )
</script>
