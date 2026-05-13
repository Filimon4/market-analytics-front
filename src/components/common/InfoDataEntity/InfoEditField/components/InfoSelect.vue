<template>
  <n-select
    v-model:value="localValue"
    :options="options"
    size="small"
    :placeholder="''"
    :loading="loading"
    @update:value="handleSelectUpdate"
  />
</template>

<script setup lang="ts">
  import { NSelect, type SelectOption } from 'naive-ui'
  import type { SelectOptionWithPayload, SelectResponseItem } from '../InfoEditField.types'
  import { onMounted, ref } from 'vue'
  import api from '@/src/utils/api'

  const localValue = defineModel<string | number>('value', {
    required: true,
  })

  const props = withDefaults(
    defineProps<{
      selectUrl: string
    }>(),
    {}
  )

  const loading = ref<boolean>(false)
  const options = ref<SelectOptionWithPayload[]>([])

  const handleSelectUpdate = (
    newValue: string | number | null,
    option: SelectOption | SelectOption[] | null
  ) => {
    console.log(newValue, option)
  }

  const fetchDataForSelect = async () => {
    if (!props.selectUrl) {
      options.value = []
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

    options.value = response.data.result.map(item => ({
      label: item.code,
      value: item.id,
      payload: item,
    }))

    loading.value = false
  }

  onMounted(() => {
    fetchDataForSelect()
  })
</script>
