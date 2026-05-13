<template>
  <n-select
    v-model:value="localValue"
    :options="[
      { label: 'Да', value: 1 },
      { label: 'Нет', value: 0 },
    ]"
    size="small"
    :placeholder="''"
  />
</template>

<script setup lang="ts">
  import { NSelect } from 'naive-ui'

  const localValue = defineModel<0 | 1>('value', {
    required: true,
  })
</script>
