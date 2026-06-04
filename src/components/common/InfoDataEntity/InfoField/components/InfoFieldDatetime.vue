<template>
  {{ displayValue }}
</template>

<script setup lang="ts">
  import { DateTime } from 'luxon'
  import { computed } from 'vue'

  const props = defineProps<{
    value?: unknown
  }>()

  const displayValue = computed(() => {
    if (props.value === null || props.value === undefined) return ''

    if (typeof props.value === 'number') {
      return DateTime.fromMillis(props.value, { zone: 'utc' }).toISO() || ''
    }

    const dateTime = DateTime.fromISO(String(props.value), { zone: 'utc' })
    if (!dateTime.isValid) return ''

    return dateTime.toISO() || ''
  })
</script>
