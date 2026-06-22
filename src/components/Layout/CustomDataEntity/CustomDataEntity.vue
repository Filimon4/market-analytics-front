<template>
  <div v-if="loading" class="loading-overlay" />
  <Affix v-if="loading" :top="'50%'" :right="'50%'" :transform="'translateX(50%)'" :z-index="10000">
    <n-spin size="large" />
  </Affix>
  <div class="blocks">
    <div v-for="block in infoDataEntityStore.blocksData" :key="block.code" class="block">
      <slot
        name="block-header"
        :block="block"
        :title="block.name"
        :code="block.code"
        v-if="!block.blockType || block.blockType === 'table' || block.blockType === 'tree'"
      >
        <div class="block-header">
          <p>{{ block.name }}</p>
        </div>
      </slot>

      <div class="block-content" :class="{ 'tree-view': block.blockType === 'tree' }">
        <BlockTableContent v-if="!block.blockType || block.blockType === 'table'" :block="block">
          <template #field="{ field, block }">
            <slot name="field" :field="field" :block="block" />
          </template>
        </BlockTableContent>

        <BlockTreeContent v-else-if="block.blockType === 'tree'" :block="block">
          <template #field="{ block }">
            <slot name="tree" :block="block" />
          </template>
        </BlockTreeContent>
      </div>

      <div class="block-actions" v-if="getBlockActions(block.code)">
        <button
          v-for="action in getBlockActions(block.code)"
          :key="action.code"
          class="action-btn"
          :class="`size-${action.size}`"
          @click="emit('click:action', action.code)"
        >
          {{ action.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import type { Action } from './CustomDataEntity.type'
  import BlockTableContent from './DataContentType/BlockTableContent.vue'
  import BlockTreeContent from './DataContentType/BlockTreeContent.vue'
  import Affix from '../../common/Affix/Affix.vue'

  const infoDataEntityStore = useInfoDataEntityStore()

  const props = withDefaults(
    defineProps<{
      // Bypass for actions
      actions?: Action[]
      loading: boolean
    }>(),
    {
      actions: () => [],
      loading: false,
    }
  )

  const emit = defineEmits(['click:action'])

  const getBlockActions = (blockCode: string): Action[] | null => {
    const blockActions = props.actions.filter(b => b.blockCode === blockCode)
    return blockActions.length ? blockActions : null
  }
</script>

<style scoped lang="scss">
  .loading-overlay {
    position: absolute;
    inset: 0;
    background: $color-surface-overlay;
    z-index: 9999;
  }

  .blocks {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    padding: 24px;
  }

  .block {
    background: $color-surface;
    border: 1px solid $color-border-default;
    border-radius: 8px;
    overflow: hidden;
  }

  .block-header {
    padding: 12px 24px;
    background: $color-surface-header;
    border-bottom: 1px solid $color-border-default;
  }

  .block-header p {
    margin: 0;
    font-size: 1.15em;
    color: $color-text-strong;
  }

  .block-content {
    display: flex;
    flex-direction: row;
    gap: 24px;
    padding: 16px 20px;
  }

  /* Action buttons area */
  .block-actions {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid $color-border-light;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    background: $color-surface-action;
  }

  .action-btn {
    border: 1px solid $color-border-action;
    border-radius: 0.375rem;
    background: $color-white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.12s;
  }

  .action-btn:hover {
    background: $color-surface-hover;
  }

  /* Size variants */
  .size-small {
    padding: 0.35rem 0.75rem;
    font-size: 0.875rem;
  }
  .size-medium {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
  .size-large {
    padding: 0.65rem 1.35rem;
    font-size: 1.05rem;
  }

  /* New override for tree view */
  .block-content.tree-view {
    display: block;
    flex-direction: unset;
    gap: 0;
  }

  @media (max-width: 900px) {
    .block-content {
      flex-direction: column;
      gap: 28px;
    }
  }
</style>
