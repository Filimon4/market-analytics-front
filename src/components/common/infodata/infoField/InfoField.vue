<template>
  <!-- <template v-if="props.type === 'select'">
    <n-select vertical :options="options" :value="props.value" :loading="loading" disabled />
  </template>
  <template v-else>
  </template> -->
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
      Partial<Pick<IField, 'type' | 'selectUrl' | 'editable'>> & {
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

  // const options = ref<SelectOption[]>([])
  // const loading = ref(false)

  // const fetchDataForSelect = async () => {
  //   if (!props.selectUrl) {
  //     options.value = []
  //     return
  //   }

  //   loading.value = true

  //   const response = await api
  //     .get<{ response: { id: string; title: string }[] }>(props.selectUrl)
  //     .catch(() => {
  //       return null
  //     })

  //   if (!response?.data.response) {
  //     loading.value = false
  //     return
  //   }

  //   options.value = response.data.response.map((item: { id: string; title: string }) => ({
  //     label: item.title,
  //     value: item.id,
  //   }))

  //   loading.value = false
  // }

  const formatFieldValue = computed(() => {
    if (props.value === null || props.value === undefined) return ''

    if (props.type === 'datetime') {
      return DateTime.fromISO(props.value as string, {
        zone: 'utc',
        locale: 'ru',
      })
        .setLocale('ru')
        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
        .replace(' г.,', ' г.')
    }

    if (props.type == 'number') {
      return Number(props.value)
    }

    if (props.type === 'boolean') {
      return props.value ? 'Да' : 'Нет'
    }

    return props.value
  })

  // onMounted(() => {
  //   if (props.type === 'select') {
  //     fetchDataForSelect()
  //   }
  // })
</script>

<style scoped>
  .editable-cursor:hover {
    transform: scale(1.5);
    cursor: pointer;
  }
</style>
