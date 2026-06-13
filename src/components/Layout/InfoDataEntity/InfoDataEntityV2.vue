<template>
  <div class="entity-wrapper">
    <CustomDataEntityV2 :loading="loading">
      <template #table="{ block }">
        <BlockTableContent
          :block="block"
          @click:action="(...args) => emit('click:action', ...args)"
        >
          <template #field="{ field }">
            <InfoEditableField
              :field="field"
              :editable="field.editable"
              :value="infoDataEntityStore.getValueOfField(field)"
            />
          </template>
        </BlockTableContent>
      </template>
      <template #metrics="{ block }">
        <BlockMetricContent
          :block="block"
          @click:action="(...args) => emit('click:action', ...args)"
        />
      </template>
    </CustomDataEntityV2>

    <SaveAffix v-show="infoDataEntityStore.hasChanges" @save="saveAll" @cancel="cancelAll" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
  import CustomDataEntityV2 from '../CustomDataEntityV2/CustomDataEntityV2.vue'
  import BlockMetricContent from '../CustomDataEntityV2/DataContentTypeV2/BlockMetricContent.vue'
  import BlockTableContent from '../CustomDataEntityV2/DataContentTypeV2/BlockTableContent.vue'
  import InfoEditableField from '../../common/InfoDataEntity/InfoEditableField/InfoEditableField.vue'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2/index.ts'
  import type { IEntity } from '@/src/utils/api/models/infoEntityV2.base.ts'
  import SaveAffix from '../../common/Affix/SaveAffix.vue'

  const loading = ref<boolean>(true)

  const emit = defineEmits(['click:action'])

  const infoDataEntityStore = useInfoDataEntityStoreV2()

  const props = defineProps({
    fetchDataReq: {
      required: true,
      type: Function as PropType<() => Promise<IEntity>>,
    },
    saveDataReq: {
      required: true,
      type: Function as PropType<(data: IEntity['data']) => Promise<boolean>>,
    },
  })

  const fetchData = async () => {
    loading.value = true
    infoDataEntityStore.clearEntityData()
    const result = await props.fetchDataReq()
    infoDataEntityStore.setData(result.data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    infoDataEntityStore.setBlocks(result.blocks as any)
    infoDataEntityStore.setBlockDetails(result.blockDetails)
    loading.value = false
  }

  const saveAll = async () => {
    const resonse = await props.saveDataReq(
      infoDataEntityStore.prebuiltSaveData() as IEntity['data']
    )

    if (!resonse) {
      return
    }

    await fetchData()
  }

  const cancelAll = () => {
    infoDataEntityStore.resetData()
  }

  onMounted(() => {
    fetchData()
  })

  onBeforeUnmount(() => {
    infoDataEntityStore.clearEntityData()
  })
</script>

<style>
  .entity-wrapper {
    height: max-content;
    width: 100%;
    position: relative;
  }
</style>
