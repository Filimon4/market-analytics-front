<template>
  <div class="block-header">
    <p class="block-header-title">{{ props.block.name }}</p>
  </div>
  <div class="block-content-thin">
    <Tree
      v-if="loaded"
      v-model:value="localValue"
      :cascade="options.cascade"
      :checkable="options.checkable"
    />
  </div>
  <div class="block-actions" v-if="getBlockActions()">
    <button
      v-for="action in getBlockActions()"
      :key="action.code"
      class="action-btn"
      :class="`size-${action.size}`"
      @click="emit('click:action', action.code)"
    >
      {{ action.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import Tree from '@/src/components/Ui/Tree/Tree.vue'
  import type { TreeNodes } from '@/src/components/Ui/Tree/types'
  import type {
    IBlockAction,
    ITreeBlock,
    ITreeBlockDetail,
  } from '@/src/utils/api/models/infoEntityV2.base'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2'

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const props = defineProps<{
    block: ITreeBlock
  }>()

  const emit = defineEmits(['click:action'])

  const loaded = ref<boolean>(false)
  const localValue = ref<TreeNodes>([])
  const options = ref<{ cascade?: boolean; checkable?: boolean }>({})

  const getBlockTreeDetails = () => {
    return infoDataEntityStore.getBlockDetails<ITreeBlockDetail>(props.block.code)
  }

  const getBlockActions = (): IBlockAction[] | null => {
    if (!props.block.actions?.length) return null
    const blockActions = props.block.actions
    return blockActions.length ? blockActions : null
  }

  const setTreeNodes = () => {
    const nodes = infoDataEntityStore.getTreeNodes(getBlockTreeDetails())
    localValue.value = nodes.nodes
    options.value = {
      cascade: nodes.cascade,
      checkable: nodes.checkable,
    }
  }

  onMounted(() => {
    setTreeNodes()
    loaded.value = true
  })

  watch(
    () => infoDataEntityStore.getCancelationToken(),
    () => {
      setTreeNodes()
    }
  )
</script>
