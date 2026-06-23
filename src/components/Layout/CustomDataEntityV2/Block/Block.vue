<template>
  <slot name="title">
    <div class="block-header">
      <p class="block-header-title">{{ props.title }}</p>
    </div>
  </slot>
  <slot></slot>
  <slot name="actions">
    <div class="block-actions" v-if="props.actions">
      <button
        v-for="action in props.actions"
        :key="action.code"
        class="action-btn"
        :class="`size-${action.size}`"
        @click="() => emit('click:action', action.code)"
      >
        {{ action.title }}
      </button>
    </div>
  </slot>
</template>

<script setup lang="ts">
  import type { IBlockAction } from '@/src/utils/api/models/infoEntityV2.base'

  const props = withDefaults(
    defineProps<{
      title: string
      actions: IBlockAction[]
    }>(),
    {
      actions: () => [],
    }
  )

  const emit = defineEmits(['click:action'])
</script>
