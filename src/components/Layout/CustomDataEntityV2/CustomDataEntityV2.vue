<template>
  <div v-if="props.loading" class="loading-overlay" />
  <Affix
    v-if="props.loading"
    :top="'50%'"
    :right="'50%'"
    :transform="'translateX(50%)'"
    :z-index="10000"
  >
    <n-spin size="large" />
  </Affix>
  <div class="blocks">
    <div v-for="block in infoDataEntityStore.blocksData" :key="block.code" class="block">
      <template v-if="block.blockType === 'metrics'">
        <slot name="metrics" :block="block"></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import Affix from '../../common/Affix/Affix.vue'

  const props = withDefaults(
    defineProps<{
      loading: boolean
    }>(),
    {
      loading: false,
    }
  )

  const infoDataEntityStore = useInfoDataEntityStore()
</script>

<style>
  /* Parent */
  .blocks {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    padding: 24px;
  }

  .block {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  /* Childrens */

  :deep(.block-header) {
    padding: 12px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
  }

  :deep(.block-header-title) {
    margin: 0;
    font-size: 1.15em;
    color: #1a1a1a;
  }

  /* Action buttons area */
  :deep(.block-actions) {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    background: #f8fafc;
  }

  :deep(.action-btn) {
    border: 1px solid #cbd5e1;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.12s;
  }

  :deep(.action-btn:hover) {
    background: #f1f5f9;
  }

  /* Size variants */
  :deep(.size-small) {
    padding: 0.35rem 0.75rem;
    font-size: 0.875rem;
  }
  :deep(.size-medium) {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
  :deep(.size-large) {
    padding: 0.65rem 1.35rem;
    font-size: 1.05rem;
  }
</style>
