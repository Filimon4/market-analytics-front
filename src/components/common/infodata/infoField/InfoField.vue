<template>
  {{ formatFieldValue }}
  <span
    class="editable-cursor"
    v-if="props.editable && !props.disabled"
    @click="emit('click:edit')"
  >
    ✎
  </span>
</template>

<script setup lang="ts">
  import type { IField } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import { DateTime } from 'luxon'
  import { computed } from 'vue'

  const emit = defineEmits<{
    (e: 'click:edit'): void
  }>()

  const props = withDefaults(
    defineProps<
      Partial<Pick<IField, 'type' | 'selectUrl' | 'editable' | 'path'>> & {
        value: string | number | boolean | object
        disabled?: boolean
      }
    >(),
    {
      type: 'string',
      selectUrl: undefined,
      editable: false,
      disabled: false,
    }
  )

  const formatFieldValue = computed(() => {
    if (props.value === null || props.value === undefined) return ''

    if (props.type === 'datetime') {
      const valid = DateTime.fromISO(props.value as string, {
        zone: 'utc',
        locale: 'ru',
      })
        .setLocale('ru')
        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
        .replace(' г.,', ' г.')

      return valid || ''
    }

    if (props.type == 'number') {
      return Number(props.value)
    }

    if (props.type === 'boolean') {
      return props.value ? 'Да' : 'Нет'
    }

    if (props.type === 'select') {
      console.log(props)
      return props.value
      // return props.selectUrl!.split('.').reduce((obj: any, key: string) => obj?.[key], props.value)
    }

    return props.value
  })
</script>

<style scoped>
  .editable-cursor:hover {
    transform: scale(1.5);
    cursor: pointer;
  }
</style>
