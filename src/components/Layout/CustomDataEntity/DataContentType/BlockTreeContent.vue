<!-- TODO: Сделать получение нового дерева -->
<template>
  <!-- :data="props.treeData.nodes" -->
  <!-- :checkable="props.treeData.checkable ?? false"
  :draggable="props.treeData.draggable ?? false" -->
  <!-- :checked-keys="internalCheckedKeys" -->
  <!-- @update:checked-keys="handleCheckedUpdate" -->
  <!-- <n-tree key-field="key" label-field="label" :cascade="true" style="width: 100%" /> -->

  <div class="tree">
    <slot name="field" :block="props.block" />
  </div>
</template>

<script setup lang="ts">
  import type { IBlock } from '../CustomDataEntity.type'

  const props = defineProps<{
    block: IBlock
  }>()
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
