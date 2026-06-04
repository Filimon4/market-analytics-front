<template>
  {{ displayValue }}
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    value?: unknown
  }>()

  const displayValue = computed(() => {
    if (props.value === null || props.value === undefined) return ''
    return props.value ? 'Да' : 'Нет'
  })
</script>
