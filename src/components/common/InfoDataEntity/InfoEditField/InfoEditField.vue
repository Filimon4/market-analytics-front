<template>
  <n-input
    v-if="props.type === 'string'"
    v-model:value="localValue"
    size="small"
    :placeholder="''"
  />

  <n-input-number
    v-else-if="props.type === 'number'"
    v-model:value="localValue"
    size="small"
    :placeholder="''"
  />

  <n-select
    v-else-if="props.type === 'boolean'"
    v-model:value="localValue"
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

  <div class="actions">
    <n-button type="info" color="#2f9acc" @click="emits('save')" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="acceptIcon" alt="accept" />
        </n-icon>
      </template>
    </n-button>
    <n-button type="info" color="#7c7c7cc0" @click="emits('cancel')" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="cancelIcon" alt="cancel" />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
  import acceptIcon from '/icons/accept.svg'
  import cancelIcon from '/icons/cancel.svg'
  import type { IField } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import api from '@/src/utils/api'
  import { onMounted, ref, watch } from 'vue'
  import type { SelectOptionWithPayload, SelectResponseItem } from './InfoEditField.types'
  import type { SelectOption } from 'naive-ui'

  const emits = defineEmits(['save', 'cancel'])

  const localValue = defineModel<number | string | boolean | Record<string, unknown> | null>(
    'value',
    {
      required: true,
    }
  )

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

    if (typeof localValue.value === 'string' || typeof localValue.value === 'number') {
      selectValue.value = localValue.value
      return
    }

    if (
      localValue.value &&
      typeof localValue.value === 'object' &&
      'id' in localValue.value &&
      (typeof localValue.value.id === 'string' || typeof localValue.value.id === 'number')
    ) {
      selectValue.value = localValue.value.id
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
    localValue.value = (selectedOption?.payload ?? null) as typeof localValue.value
  }

  const syncDateTimeValueFromModel = () => {
    if (props.type !== 'datetime') return

    if (typeof localValue.value === 'number') {
      dateTimeValue.value = Number.isFinite(localValue.value) ? localValue.value : null
      return
    }

    if (typeof localValue.value === 'string' && localValue.value) {
      const parsed = Date.parse(localValue.value)
      dateTimeValue.value = Number.isNaN(parsed) ? null : parsed
      return
    }

    dateTimeValue.value = null
  }

  const handleDateTimeUpdate = (newValue: number | null) => {
    dateTimeValue.value = newValue
    localValue.value = (
      newValue === null ? null : new Date(newValue).toISOString()
    ) as typeof localValue.value
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
    () => localValue.value,
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

<style>
  .actions {
    display: flex;
    gap: 6px;
  }

  .action-sprite {
    height: 15px;
    width: 15px;
  }
</style>
