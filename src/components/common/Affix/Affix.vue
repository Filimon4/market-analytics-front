<template>
  <div :style="computedStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed, type StyleValue } from 'vue'

  const props = withDefaults(
    defineProps<{
      containerRef?: HTMLElement | null
      bottom?: string
      right?: string
      top?: string
      left?: string
      width?: string | number
      zIndex?: number
      transform?: string
      display: 'fixed' | 'absolute'
    }>(),
    {
      bottom: undefined,
      right: undefined,
      top: undefined,
      left: undefined,
      width: undefined,
      transform: undefined,
      zIndex: 10,
      display: 'fixed',
    }
  )

  const computedStyle = computed<StyleValue>(() => {
    return {
      position: props.display,
      zIndex: props.zIndex,
      width:
        props.width !== undefined
          ? typeof props.width === 'number'
            ? `${props.width}px`
            : props.width
          : undefined,

      ...(props.top !== undefined ? { top: props.top } : {}),
      ...(props.left !== undefined ? { left: props.left } : {}),
      ...(props.bottom !== undefined ? { bottom: props.bottom } : {}),
      ...(props.right !== undefined ? { right: props.right } : {}),
      ...(props.transform !== undefined ? { transform: props.transform } : {}),
    }
  })
</script>
