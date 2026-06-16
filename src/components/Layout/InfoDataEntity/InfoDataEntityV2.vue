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
        <BlockMetricContent :block="block" @click:action="handleAction" />
      </template>
      <template #viewListEntity="{ block }">
        <BlockViewListEntityContent
          :block="block"
          :refresh-trigger="refreshTriggers[block.code]"
          @click:action="handleAction"
        />
      </template>
    </CustomDataEntityV2>

    <SaveAffix v-show="infoDataEntityStore.hasChanges" @save="saveAll" @cancel="cancelAll" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, reactive, ref, type PropType } from 'vue'
  import CustomDataEntityV2 from '../CustomDataEntityV2/CustomDataEntityV2.vue'
  import BlockMetricContent from '../CustomDataEntityV2/DataContentTypeV2/BlockMetricContent.vue'
  import BlockViewListEntityContent from '../CustomDataEntityV2/DataContentTypeV2/BlockViewListEntityContent.vue'
  import BlockTableContent from '../CustomDataEntityV2/DataContentTypeV2/BlockTableContent.vue'
  import InfoEditableField from '../../common/InfoDataEntity/InfoEditableField/InfoEditableField.vue'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2/index.ts'
  import type { IEntity } from '@/src/utils/api/models/infoEntityV2.base.ts'
  import SaveAffix from '../../common/Affix/SaveAffix.vue'
  import api from '@/src/utils/api/index.ts'
  import { buildUrl } from '@/src/utils/buildUrl.ts'

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

  const refreshTriggers = reactive<Record<string, number>>({})

  const handleAction = (action: string) => {
    const ownerBlock = infoDataEntityStore.blocksData.find(block =>
      block?.actions?.some(a => a.code === action)
    )
    const actionData = ownerBlock?.actions?.find(a => a.code === action)

    if (actionData?.type === 'directRequest') {
      api
        .put(
          buildUrl(actionData.requestUrl, {
            entityId: infoDataEntityStore.initialData['id'],
          })
        )
        .then(() => {
          if (actionData.refreshTable && ownerBlock) {
            refreshTriggers[ownerBlock.code] = (refreshTriggers[ownerBlock.code] ?? 0) + 1
          }
        })
      return
    } else {
      emit('click:action', action)
    }
  }
</script>

<style>
  .entity-wrapper {
    height: max-content;
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
