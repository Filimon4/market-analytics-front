<template>
  <n-input v-model:value="localValue" size="small" :placeholder="''" />
</template>

<script setup lang="ts">
  import { NInput } from 'naive-ui'

  const localValue = defineModel<string>('value', {
    required: true,
  })
</script>
