<template>
  <div v-if="value && value.length > 0" class="info-field-formula">
    <n-tag
      v-for="(op, index) in value"
      :key="index"
      size="small"
      :color="op.color ? { textColor: op.color } : undefined"
    >
      {{ op.label }}
    </n-tag>
  </div>
</template>

<script setup lang="ts">
  import { NTag } from 'naive-ui'

  defineProps<{
    value?: { label: string | number; value: string; color?: string }[]
  }>()
</script>

<style scoped>
  .info-field-formula {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
</style>
