<template>
  {{ formatFieldValue }}
</template>

<script setup lang="ts">
  import { DateTime } from 'luxon'
  import { computed } from 'vue'
  import type { IField } from '@/src/utils/api/models/infoEntiyt.base'

  const props = withDefaults(
    defineProps<{
      value?: unknown
      type?: IField['type']
    }>(),
    {
      value: undefined,
      type: 'string',
    }
  )

  const formatFieldValue = computed(() => {
    if (props.value === null || props.value === undefined) return ''

    if (props.type === 'datetime') {
      if (typeof props.value === 'number') {
        return DateTime.fromMillis(props.value, { zone: 'utc' }).toISO() || ''
      }

      const dateTime = DateTime.fromISO(String(props.value), { zone: 'utc' })

      if (!dateTime.isValid) return ''

      return dateTime.toISO() || ''
    }

    if (props.type === 'number') {
      return Number(props.value)
    }

    if (props.type === 'boolean') {
      return props.value ? 'Да' : 'Нет'
    }

    if (props.type === 'select') {
      return props.value
    }

    return props.value
  })
</script>
