<template>
  <!-- TODO: add loader and sort filters -->
  <CustomDataEntity
    :blocks="apiResult.blocks"
    :block-details="apiResult.blockDetails"
    :data="apiResult.data"
    :actions="actions"
    @click:action="(...args: any[]) => emit('click:action', ...args)"
  >
    <template
      #field="{field, value}"      
    >
      {{ formatFieldValue(field, value) }}
    </template>
  </CustomDataEntity>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from 'vue';
import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue';
import { DateTime } from 'luxon';
import type { Action } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.types';

const apiResult = ref<{
  blocks: any[]
  blockDetails: any[]
  data: any
}>({
  blocks: [],
  blockDetails: [],
  data: []
})

const triggerTableUpdate = defineModel<boolean>({required: false, default: false})
const props = defineProps({
  fetchDataReq: {
    required: true,
    type: Function as PropType<() => Promise<any>>,
  },
  actions: {
    required: false,
    type: Array as PropType<Action[]>,
  }
})
const emit = defineEmits([
  'click:action'
])

async function fetchData() {
  apiResult.value = await props.fetchDataReq()
}

function formatFieldValue(field: any, value: any) {
  if (value === null || value === undefined) return ''
  const { type } = field

  if (type === 'datetime') {
    return DateTime.fromISO(value, {
      zone: 'utc',         
      locale: 'ru'
    }).setLocale('ru')
      .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
      .replace(' г.,', ' г.');;
  }

  if (type === 'boolean') {
    return value ? "Да" : "Нет"
  }

  return value
}

onMounted(() => {
  fetchData()
})

watch(triggerTableUpdate, (value: boolean) => {
  if (!value) return;
  fetchData()
  triggerTableUpdate.value = false
})
</script>