<template>
  <div class="tree">
    <slot name="field" :block="block" />
  </div>
</template>

<script setup lang="ts">
  import type { IBlock } from '@/src/utils/api/models/infoEntity.base'

  defineProps<{
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
