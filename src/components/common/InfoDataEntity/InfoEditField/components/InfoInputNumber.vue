<template>
  <n-input-number v-model:value="localValue" size="small" />
</template>

<script setup lang="ts">
  import { NInputNumber } from 'naive-ui'

  const localValue = defineModel<number>('value', {
    required: true,
  })
</script>
