<template>
  {{ displayValue }}
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    value?: { id: number; code: string }
  }>()

  const displayValue = computed(() => {
    if (props.value === null || props.value === undefined) return ''
    return props.value?.code
  })
</script>
