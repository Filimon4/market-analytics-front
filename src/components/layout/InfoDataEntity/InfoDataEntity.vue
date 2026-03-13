<template>
  <CustomDataEntity
    :blocks="apiResult.blocks"
    :block-details="apiResult.blockDetails"
    :data="apiResult.data"
  >
    <!-- <template #field="{ value, field }"> -->
      <!-- <span v-if="field.path === 'blocked'" :class="value ? 'text-red' : 'text-green'">
        {{ value ? 'Заблокирован' : 'Активен' }}
      </span> -->
      <!-- {{ value }} -->
    <!-- </template> -->

    <template
      #field="{field, value}"      
    >
      {{ formatFieldValue(field, value) }}
    </template>
  </CustomDataEntity>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue';
import { DateTime } from 'luxon';

const props = defineProps({
  fetchDataReq: {
    required: true,
    type: Function as PropType<() => Promise<any>>,
  },
})

const apiResult = ref({
  blocks: [],
  blockDetails: [],
  data: []
})

async function fetchData() {
  apiResult.value = await props.fetchDataReq()
}

function formatFieldValue(field: any, value: any) {
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
</script>