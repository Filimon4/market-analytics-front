<template>
  <CustomDataEntity
    :blocks="apiResult.blocks"
    :block-details="apiResult.blockDetails"
    :data="apiResult.data"
  >
    <template #field="{ value, field }">
      <!-- <span v-if="field.path === 'blocked'" :class="value ? 'text-red' : 'text-green'">
        {{ value ? 'Заблокирован' : 'Активен' }}
      </span> -->
      {{ value }}
    </template>
  </CustomDataEntity>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue';

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

onMounted(() => {
  fetchData()
})
</script>