<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    value?: string
  }>()

  const displayValue = computed(() => {
    return props.value
  })
</script>
