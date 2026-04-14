<template>
  {{ formatFieldValue }}
  <span
    class="editable-cursor"
    v-if="props.editable && !props.disabled"
    @click="emit('click:edit')"
  >
    <img :src="pencil" alt="edit" :style="{ height: '12px' }" />
  </span>
  <span class="editable-cursor" v-if="props.resetable" @click="emit('click:reset')">
    <img :src="undo" alt="undo" :style="{ height: '12px' }" />
  </span>
</template>

<script setup lang="ts">
  import type { IField } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import { DateTime } from 'luxon'
  import { computed } from 'vue'
  import undo from '/icons/undo.png'
  import pencil from '/icons/pencil.png'

  const emit = defineEmits<{
    (e: 'click:edit'): void
    (e: 'click:reset'): void
  }>()

  const props = withDefaults(
    defineProps<
      Partial<Pick<IField, 'type' | 'selectUrl' | 'editable' | 'path'>> & {
        value: string | number | boolean | object
        disabled?: boolean
        resetable?: boolean
      }
    >(),
    {
      type: 'string',
      selectUrl: undefined,
      editable: false,
      disabled: false,
      resetable: false,
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
      return props.value
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
