<template>
  {{ formatFieldValue }}
  <span
    class="editable-cursor"
    v-if="infoDataEntityStore.canEditField(field) && !infoDataEntityStore.isFieldDisabled(field)"
    @click="emit('click:edit')"
  >
    <img :src="pencil" alt="edit" :style="{ height: '12px' }" />
  </span>
  <span
    class="editable-cursor"
    v-if="
      infoDataEntityStore.isFieldDiffFromDefault(field) &&
      !infoDataEntityStore.isFieldDisabled(field)
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
      field: IField
    }>(),
    {}
  )

  const formatFieldValue = computed(() => {
    const value = infoDataEntityStore.getValueOfField(props.field)
    if (value === null || value === undefined) return ''

    if (props.field.type === 'datetime') {
      const dateTime = DateTime.fromISO(value as string, {
        zone: 'utc',
        locale: 'ru',
      }).setLocale('ru')

      if (!dateTime.isValid) return ''

      const time = dateTime
        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
        .replace(' г.,', ' г.')

      return time || ''
    }

    if (props.field.type == 'number') {
      return Number(value)
    }

    if (props.field.type === 'boolean') {
      return value ? 'Да' : 'Нет'
    }

    if (props.field.type === 'select') {
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
