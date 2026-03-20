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
    v-model:value="value"
    :options="selectOptions"
    size="small"
    :placeholder="''"
  />
</template>

<script setup lang="ts">
  import type { IField } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import api from '@/src/utils/api'
  import type { SelectOption } from 'naive-ui'
  import { ref } from 'vue'
  import { onMounted } from 'vue'

  const value = defineModel<number | string | boolean>('value', { required: true })

  const props = withDefaults(defineProps<Partial<Pick<IField, 'selectUrl' | 'type'>>>(), {
    type: 'string',
    selectUrl: undefined,
  })

  const selectOptions = ref<SelectOption[]>([])
  const loading = ref(false)

  const fetchDataForSelect = async () => {
    if (!props.selectUrl) {
      selectOptions.value = []
      return
    }

    loading.value = true

    const response = await api
      .get<{ response: { id: string; title: string }[] }>(props.selectUrl)
      .catch(() => {
        return null
      })

    if (!response?.data.response) {
      loading.value = false
      return
    }

    selectOptions.value = response.data.response.map((item: { id: string; title: string }) => ({
      label: item.title,
      value: item.id,
    }))

    loading.value = false
  }

  onMounted(() => {
    if (props.type === 'select') {
      fetchDataForSelect()
    }
  })
</script>
