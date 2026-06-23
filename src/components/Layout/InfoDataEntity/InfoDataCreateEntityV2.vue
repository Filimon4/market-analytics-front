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
    </CustomDataEntityV2>
    <SaveAffix v-model:saving="saving" @cancel="handleCancel" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
  import InfoEditableField from '@/src/components/common/InfoDataEntity/InfoEditableField/InfoEditableField.vue'
  import { useRouter } from 'vue-router'
  import SaveAffix from '@/src/components/common/Affix/SaveAffix.vue'
  import { useInfoDataEntityStoreV2 } from '@/src/store/infoDataEntityV2/index.ts'
  import type {
    Data,
    IEntity,
    IMetricsBlockDetail,
    ITableBlockDetail,
  } from '@/src/utils/api/models/infoEntityV2.base.ts'
  import CustomDataEntityV2 from '@/src/components/Layout/CustomDataEntityV2/CustomDataEntityV2.vue'
  import BlockTableContent from '@/src/components/Layout/CustomDataEntityV2/CustomContent/BlockTableContent.vue'

  const emit = defineEmits(['click:action'])

  const infoDataEntityStore = useInfoDataEntityStoreV2()
  const router = useRouter()

  const saving = ref(false)
  const loading = ref<boolean>(false)

  const props = defineProps({
    fetchDataReq: {
      required: true,
      type: Function as PropType<() => Promise<Pick<IEntity, 'blocks' | 'blockDetails'>>>,
    },
    saveDataReq: {
      required: true,
      type: Function as PropType<(data: Data) => Promise<{ id: string }>>,
    },
  })

  async function fetchData() {
    loading.value = true
    infoDataEntityStore.clearEntityData()
    const response = await props.fetchDataReq()

    const blocks = response.blocks.filter(block => {
      if (block?.createHide !== undefined && block?.createHide) {
        return false
      }
      return true
    })

    infoDataEntityStore.setBlocks(blocks)
    infoDataEntityStore.setBlockDetails(response.blockDetails)
    infoDataEntityStore.setData({})

    const blockTables = blocks.filter(block => block.blockType === 'table')
    response.blockDetails
      .filter(block => blockTables.map(bt => bt.code).includes(block.blockCode))
      .flatMap(block2 => (block2 as ITableBlockDetail | IMetricsBlockDetail).fields)
      .filter(field => !field.editable && field.createDefault !== undefined)
      .forEach(defaultField => {
        infoDataEntityStore.updateFieldValue(defaultField.path, defaultField.createDefault)
      })

    // Keep defaults as the initial state for create mode.
    infoDataEntityStore.setData(infoDataEntityStore.prebuiltSaveData() as Data)
    loading.value = false
  }

  async function handleSave() {
    if (saving.value) return
    saving.value = true
    const response = await props.saveDataReq(infoDataEntityStore.prebuiltSaveData()).catch(() => {
      return null
    })

    if (!response) {
      saving.value = false
      return
    }

    router.push(response.id)
    saving.value = false
  }

  function handleCancel() {
    router.back()
  }

  onMounted(() => {
    fetchData()
  })

  onBeforeUnmount(() => {
    infoDataEntityStore.clearEntityData()
  })
</script>

<style scoped lang="scss">
  @use './styles/InfoDataEntityV2.mixins' as *;
  @include custom-data-entity;
</style>
