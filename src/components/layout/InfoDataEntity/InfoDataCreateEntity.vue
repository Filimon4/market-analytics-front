<template>
  <!-- TODO: add loader and sort filters -->
  <CustomDataEntity :blocks="apiResult.blocks" :block-details="apiResult.blockDetails" :data="data">
    <template #field="{ field, value }">
      <FieldRenderer :field="field" :value="value" @update="handleFieldUpdate" />
    </template>
  </CustomDataEntity>
</template>

<script setup lang="ts">
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import FieldRenderer from './FieldRenderer.vue'
  import type { Data, IEntity, IField } from '../CustomDataEntity/CustomDataEntity.types'

  const data = ref({})

  const apiResult = ref<Pick<IEntity, 'blocks' | 'blockDetails'>>({
    blocks: [],
    blockDetails: [],
  })

  const props = defineProps({
    fetchDataReq: {
      required: true,
      type: Function as PropType<() => Promise<Pick<IEntity, 'blocks' | 'blockDetails'>>>,
    },
  })

  async function fetchData() {
    const response = await props.fetchDataReq()

    apiResult.value = {
      blocks: response.blocks.filter(b => {
        if (b?.createHide !== undefined && b?.createHide) {
          return false
        }
        return true
      }),
      blockDetails: response.blockDetails,
    }
  }

  function handleFieldUpdate({ field, value }: { field: IField; value: Data[string] }) {
    console.log('Field update:', field.title, '→', value)
  }

  onMounted(() => {
    fetchData()
  })
</script>
