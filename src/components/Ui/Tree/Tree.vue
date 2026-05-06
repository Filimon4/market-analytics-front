<template>
  <div class="tree-view">
    <TreeNode
      v-for="node in value"
      :key="node.key"
      :node="node"
      :toggle-node="toggleNode"
      :expanded-ids="expandedIds"
      :checkable="checkable"
      @toggle-expand="toggleExpand"
      @node:click="node => emits('node:click', node)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import TreeNode from './TreeNode.vue'
  import { useTree } from './useTree'
  import type { TreeNode as TreeNodeType } from './types'

  const props = defineProps<{
    cascade?: boolean
    checkable?: boolean
  }>()

  const emits = defineEmits(['node:click'])

  const value = defineModel<TreeNodeType[]>('value', {
    required: true,
    default: [],
  })

  const { toggleNode } = useTree({
    cascade: props.cascade || false,
    checkable: props.checkable || false,
  })
  const expandedIds = ref(new Set<string | number>())

  const toggleExpand = (id: string | number) => {
    if (expandedIds.value.has(id)) {
      expandedIds.value.delete(id)
    } else {
      expandedIds.value.add(id)
    }
  }
</script>

<style scoped>
  .tree-view {
    font-size: 14px;
  }
</style>
