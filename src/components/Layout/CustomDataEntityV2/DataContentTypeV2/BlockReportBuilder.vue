<template>
  <div class="block-header">
    <p class="block-header-title">{{ props.block.name }}</p>
  </div>
  <div class="block-content-thin">Body</div>
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
  import type { IBlockAction, IReportBuilderBlock } from '@/src/utils/api/models/infoEntityV2.base'

  const props = defineProps<{
    block: IReportBuilderBlock
  }>()

  const emit = defineEmits(['click:action'])

  const getBlockActions = (): IBlockAction[] | null => {
    if (!props.block.actions?.length) return null
    const blockActions = props.block.actions
    return blockActions.length ? blockActions : null
  }
</script>
