<template>
  <div class="block-header">
    <p class="block-header-title">{{ props.block.name }}</p>
  </div>
  <div class="block"></div>
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
</template>

<script setup lang="ts">
  import type { IBlock } from '@/src/utils/api/models/infoEntityV2.base'
  import type { Action } from '../CustomDataEntityV2.type'

  const props = defineProps<{
    block: IBlock
  }>()

  const emit = defineEmits(['click:action'])

  const getBlockActions = (blockCode: string): Action[] | null => {
    if (!props.block.actions?.length) return null
    const blockActions = props.block.actions.filter(b => b.blockCode === blockCode)
    return blockActions.length ? blockActions : null
  }
</script>
