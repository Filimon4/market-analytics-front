<template>
  <n-tree
    :data="props.treeData.nodes"
    key-field="key"
    label-field="label"
    :checkable="props.treeData.checkable ?? false"
    :draggable="props.treeData.draggable ?? false"
    :checked-keys="internalCheckedKeys"
    @update:checked-keys="handleCheckedUpdate"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
  import { NTree } from 'naive-ui'
  import { ref } from 'vue'
  import type { Tree } from '../CustomDataEntity.type'

  const props = defineProps<{
    treeData: Tree
  }>()

  const emit = defineEmits<{
    (e: 'update:checked-keys', keys: string[]): void
  }>()

  // Внутреннее состояние (инициализируем значениями по умолчанию с бэка)
  const internalCheckedKeys = ref<string[]>(props.treeData.defaultCheckedKeys ?? [])

  const handleCheckedUpdate = (keys: string[]) => {
    internalCheckedKeys.value = keys
    emit('update:checked-keys', keys)
  }
</script>

<style scoped>
  :deep(.n-tree) {
    font-size: 0.95em;
  }

  :deep(.n-tree-node-wrapper) {
    --n-node-wrapper-padding: 10px !important;
  }

  /* оставляем на случай, если родительский .block-content.tree-view используется */
  @media (max-width: 900px) {
    .block-content.tree-view {
      flex-direction: unset;
    }
  }
</style>
