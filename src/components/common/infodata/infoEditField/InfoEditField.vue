<template>
  <n-input v-if="props.type === 'string'" v-model:value="value" size="small" :placeholder="''" />

  <n-input-number
    v-else-if="props.type === 'number'"
    v-model:value="value"
    size="small"
    :placeholder="''"
  />

  <n-select
    v-else-if="props.type === 'boolean'"
    v-model:value="value"
    :options="[
      { label: 'Все', value: '' },
      { label: 'Да', value: 'true' },
      { label: 'Нет', value: 'false' },
    ]"
    size="small"
    :placeholder="''"
  />

  <n-select
    v-else-if="props.type === 'select'"
    :value="selectValue"
    :options="selectOptions"
    :loading="loading"
    size="small"
    :placeholder="''"
    @update:value="handleSelectUpdate"
  />

  <n-date-picker
    v-else-if="props.type === 'datetime'"
    :value="dateTimeValue"
    type="datetime"
    clearable
    @update:value="handleDateTimeUpdate"
  />
</template>

<script setup lang="ts">
  import type { IField } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import api from '@/src/utils/api'
  import type { SelectOption } from 'naive-ui'
  import { onMounted, ref, watch } from 'vue'

  type SelectResponseItem = {
    id: string
    code: string
    [key: string]: unknown
  }

  type SelectOptionWithPayload = SelectOption & {
    value: string
    payload: SelectResponseItem
  }

  const value = defineModel<number | string | boolean | Record<string, unknown> | null>('value', {
    required: true,
  })

  const props = withDefaults(defineProps<Partial<Pick<IField, 'selectUrl' | 'type'>>>(), {
    type: 'string',
    selectUrl: undefined,
  })

  const selectOptions = ref<SelectOptionWithPayload[]>([])
  const selectValue = ref<string | number | null>(null)
  const dateTimeValue = ref<number | null>(null)
  const loading = ref(false)

  const syncSelectValueFromModel = () => {
    if (props.type !== 'select') return

    if (typeof value.value === 'string' || typeof value.value === 'number') {
      selectValue.value = value.value
      return
    }

    if (
      value.value &&
      typeof value.value === 'object' &&
      'id' in value.value &&
      (typeof value.value.id === 'string' || typeof value.value.id === 'number')
    ) {
      selectValue.value = value.value.id
      return
    }

    selectValue.value = null
  }

  const handleSelectUpdate = (
    newValue: string | number | null,
    option: SelectOption | SelectOption[] | null
  ) => {
    const selectedOption = option as SelectOptionWithPayload | null

    selectValue.value = newValue
    value.value = (selectedOption?.payload ?? null) as typeof value.value
  }

  const syncDateTimeValueFromModel = () => {
    if (props.type !== 'datetime') return

    if (typeof value.value === 'number') {
      dateTimeValue.value = Number.isFinite(value.value) ? value.value : null
      return
    }

    if (typeof value.value === 'string' && value.value) {
      const parsed = Date.parse(value.value)
      dateTimeValue.value = Number.isNaN(parsed) ? null : parsed
      return
    }

    dateTimeValue.value = null
  }

  const handleDateTimeUpdate = (newValue: number | null) => {
    dateTimeValue.value = newValue
    value.value = (
      newValue === null ? null : new Date(newValue).toISOString()
    ) as typeof value.value
  }

  const fetchDataForSelect = async () => {
    if (!props.selectUrl) {
      selectOptions.value = []
      return
    }

    loading.value = true

    const response = await api.get<{ result: SelectResponseItem[] }>(props.selectUrl).catch(() => {
      return null
    })

    if (!response?.data.result) {
      loading.value = false
      return
    }

    selectOptions.value = response.data.result.map(item => ({
      label: item.code,
      value: item.id,
      payload: item,
    }))
    syncSelectValueFromModel()

    loading.value = false
  }

  watch(
    () => value.value,
    () => {
      syncSelectValueFromModel()
      syncDateTimeValueFromModel()
    },
    { deep: true }
  )

  onMounted(() => {
    if (props.type === 'select') {
      fetchDataForSelect()
    }

    if (props.type === 'datetime') {
      syncDateTimeValueFromModel()
    }
  })
</script>
