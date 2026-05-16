<!-- TODO: Поправить сохранение селекта и сброс обратно -->
<template>
  <n-select
    v-model:value="selectedValue"
    :options="options"
    size="small"
    :placeholder="''"
    :loading="loading"
    @update:value="handleSelectUpdate"
  />
</template>

<script setup lang="ts">
  import { NSelect, type SelectOption } from 'naive-ui'
  import type { SelectOptionWithPayload } from '../InfoEditField.types'
  import { onMounted, ref, watch } from 'vue'
  import api from '@/src/utils/api'

  const localValue = defineModel<string>('value', {
    required: true,
  })

  const selectedValue = ref<number>()

  const props = withDefaults(
    defineProps<{
      selectUrl: string
    }>(),
    {}
  )

  const loading = ref<boolean>(false)
  const options = ref<SelectOptionWithPayload[]>([])

  const handleSelectUpdate = (newValue: number, option: SelectOption) => {
    selectedValue.value = option.value as number
  }

  const fetchDataForSelect = async () => {
    if (!props.selectUrl) {
      options.value = []
      return
    }

    loading.value = true

    const response = await api
      .get<{ result: { code: string; id: number }[] }>(props.selectUrl)
      .catch(() => {
        return null
      })

    if (!response?.data.result) {
      loading.value = false
      return
    }

    options.value = response.data.result.map(item => ({
      label: item.code,
      value: item.id,
      payload: item,
    }))

    loading.value = false
  }

  onMounted(async () => {
    await fetchDataForSelect()

    selectedValue.value = Number(options.value.find(opt => opt.label === localValue.value)?.value)
  })

  watch(
    () => selectedValue.value,
    () => {
      const optionNewValue = String(
        options.value.find(opt => opt.value === selectedValue.value)?.label
      )
      localValue.value = optionNewValue
    }
  )
</script>
