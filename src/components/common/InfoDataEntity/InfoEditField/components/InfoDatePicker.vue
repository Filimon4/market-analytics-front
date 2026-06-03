<template>
  <n-date-picker v-model:value="localValue" type="datetime" clearable />
</template>

<script setup lang="ts">
  import { NDatePicker } from 'naive-ui'

  const localValue = defineModel<number | null>('value')
</script>
