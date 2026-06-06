<template>
  <NTime v-if="timeValue !== null" :time="timeValue" />
</template>

<script setup lang="ts">
  import { DateTime } from 'luxon'
  import { NTime } from 'naive-ui'
  import { computed } from 'vue'

  const props = defineProps<{
    value?: unknown
  }>()

  const timeValue = computed<number | null>(() => {
    if (props.value === null || props.value === undefined) return null

    if (typeof props.value === 'number') {
      const dateTime = DateTime.fromMillis(props.value, { zone: 'utc' })
      return dateTime.isValid ? dateTime.toMillis() : null
    }

    const dateTime = DateTime.fromISO(String(props.value), { zone: 'utc' })
    if (!dateTime.isValid) return null

    return dateTime.toMillis()
  })
</script>
