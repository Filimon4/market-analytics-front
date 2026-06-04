<template>
  {{ formatFieldValue }}
  <span
    class="editable-cursor"
    v-if="
      props.field &&
      infoDataEntityStore.canEditField(props.field) &&
      !infoDataEntityStore.isFieldDisabled(props.field)
    "
    @click="emit('click:edit')"
  >
    <img :src="pencil" alt="edit" :style="{ height: '12px' }" />
  </span>
  <span
    class="editable-cursor"
    v-if="
      props.field &&
      infoDataEntityStore.isFieldDiffFromDefault(props.field) &&
      !infoDataEntityStore.isFieldDisabled(props.field)
    "
    @click="emit('click:reset')"
  >
    <img :src="undo" alt="undo" :style="{ height: '12px' }" />
  </span>
</template>

<script setup lang="ts">
  import { DateTime } from 'luxon'
  import { computed } from 'vue'
  import undo from '/icons/undo.png'
  import pencil from '/icons/pencil.png'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import type { IField } from '@/src/utils/api/models/infoEntiyt.base'

  const infoDataEntityStore = useInfoDataEntityStore()

  const emit = defineEmits<{
    (e: 'click:edit'): void
    (e: 'click:reset'): void
  }>()

  const props = withDefaults(
    defineProps<{
      field?: IField
      value?: unknown
      type?: IField['type']
    }>(),
    {
      field: undefined,
      value: undefined,
      type: 'string',
    }
  )

  const formatFieldValue = computed(() => {
    const value = props.field ? infoDataEntityStore.getValueOfField(props.field) : props.value
    if (value === null || value === undefined) return ''

    const fieldType = props.field?.type ?? props.type

    if (fieldType === 'datetime') {
      if (typeof value === 'number') {
        return DateTime.fromMillis(value, { zone: 'utc' }).toISO() || ''
      }

      const dateTime = DateTime.fromISO(String(value), { zone: 'utc' })

      if (!dateTime.isValid) return ''

      return dateTime.toISO() || ''
    }

    if (fieldType === 'number') {
      return Number(value)
    }

    if (fieldType === 'boolean') {
      return value ? 'Да' : 'Нет'
    }

    if (fieldType === 'select') {
      console.log(value)
      return value
    }

    return value
  })
</script>

<style scoped>
  .editable-cursor:hover {
    transform: scale(1.5);
    cursor: pointer;
  }
</style>
