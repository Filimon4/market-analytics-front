<template>
  <div class="tree-node">
    <div class="node-row">
      <!-- Expand Icon -->
      <span
        v-if="hasChildren"
        class="expand-icon"
        @click.stop="emit('toggle-expand', props.node.key)"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span v-else class="expand-icon-placeholder"></span>

      <!-- Checkbox -->
      <input
        v-if="props.checkable"
        type="checkbox"
        :checked="props.node.checked"
        :indeterminate="props.node.checked === false && hasAnyChecked(props.node)"
        :disabled="props.node.disabled"
        class="node-checkbox"
        @change="toggleNode(props.node)"
      />

      <!-- Icon -->
      <span v-if="props.node.icon" class="node-icon">{{ node.icon }}</span>

      <!-- Label -->
      <span
        class="node-label"
        :class="{ 'is-disabled': props.node.disabled }"
        @click="emit('node:click', props.node)"
      >
        {{ props.node.label }}
      </span>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" class="children">
      <TreeNode
        v-for="child in props.node.children"
        :key="child.key"
        :node="child"
        :toggle-node="toggleNode"
        :expanded-ids="expandedIds"
        :checkable="checkable"
        @toggle-expand="$emit('toggle-expand', $event)"
        @node:click="$emit('node:click', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { TreeNode } from './types'
  import { computed } from 'vue'

  const props = defineProps<{
    node: TreeNode
    toggleNode: (node: TreeNode) => void
    expandedIds: Set<string | number>
    checkable: boolean
  }>()

  const emit = defineEmits<{
    'toggle-expand': [id: string | number]
    'node:click': [node: TreeNode]
  }>()

  const isExpanded = computed(() => props.expandedIds.has(props.node.key))

  const hasChildren = computed(() => !!props.node.children?.length)

  const hasAnyChecked = (node: TreeNode): boolean => {
    if (node.checked) return true
    return node.children?.some((c: TreeNode) => hasAnyChecked(c)) ?? false
  }
</script>

<style scoped lang="scss">
  .node-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    cursor: pointer;
  }

  .node-row:hover {
    background-color: $color-surface-muted;
  }

  .expand-icon,
  .expand-icon-placeholder {
    width: 1.25rem;
  }

  .expand-icon {
    color: $color-text-disabled;
    user-select: none;
  }

  .node-checkbox {
    accent-color: $color-accent-blue;
  }

  .node-icon {
    margin-right: 0.5rem;
    font-size: 1.125rem;
  }

  .node-label {
    flex: 1;
  }

  .node-label.is-disabled {
    color: $color-text-disabled-light;
    text-decoration: line-through;
  }

  .children {
    margin-left: 1.5rem;
    padding-left: 0.5rem;
    border-left: 1px solid $color-border-muted;
  }
</style>
