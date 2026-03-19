<template>
  <div style="height: 100%; width: 100%; position: relative">
    <!-- TODO: add loader and sort filters -->
    <CustomDataEntity
      :blocks="apiResult.blocks"
      :block-details="apiResult.blockDetails"
      :data="data"
    >
      <template #field="{ field, value }">
        <FieldRenderer :field="field" :value="value" @update="handleFieldUpdate" />
      </template>
    </CustomDataEntity>
    <Affix :bottom="'10px'" :right="'50%'" :transform="'translateX(50%)'">
      <div class="entity-submit">
        <n-button type="primary" :loading="saving" @click="handleSave" color="#2f9acc"
          >Сохранить</n-button
        >
        <n-button @click="handleCancel" color="#7c7c7cc0">Отмена</n-button>
      </div>
    </Affix>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import FieldRenderer from './FieldRenderer.vue'
  import type { Data, IEntity, IField } from '../CustomDataEntity/CustomDataEntity.types'
  import Affix from '../../common/affix/Affix.vue'

  const saving = ref(false)

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

  function handleSave() {
    /* ... */
  }
  function handleCancel() {
    /* ... */
  }
</script>

<style scoped>
  .entity-submit {
    display: flex;
    gap: 10px;
    flex-wrap: nowrap;
  }
</style>
