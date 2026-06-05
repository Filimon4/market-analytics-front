<template>
  <div class="entity-wrapper">
    <CustomDataEntity :loading="loading">
      <template #field="{ field }">
        <InfoEditableField
          :field="field"
          :value="infoDataEntityStore.getValueOfField(field)"
          @update="handleFieldUpdate"
        />
      </template>
    </CustomDataEntity>
    <SaveAffix v-model:saving="saving" @cancel="handleCancel" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import InfoEditableField from '@/src/components/common/InfoDataEntity/InfoEditableField/InfoEditableField.vue'
  import { useRouter } from 'vue-router'
  import SaveAffix from '@/src/components/common/Affix/SaveAffix.vue'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import type {
    Data,
    IBlockDetail,
    IEntity,
    IField,
  } from '@/src/utils/api/models/infoEntity.base.ts'

  const infoDataEntityStore = useInfoDataEntityStore()
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
      .flatMap(block2 => (block2 as IBlockDetail).fields)
      .filter(field => !field.editable && field.createDefault !== undefined)
      .forEach(defaultField => {
        infoDataEntityStore.updateFieldValue(defaultField.path, defaultField.createDefault)
      })

    // Keep defaults as the initial state for create mode.
    infoDataEntityStore.setData(infoDataEntityStore.prebuiltSaveData() as Data)
    loading.value = false
  }

  function handleFieldUpdate({ field, value }: { field: IField; value: Data[string] }) {
    infoDataEntityStore.updateFieldValue(field.path, value)
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
    infoDataEntityStore.clearEntityData()
    router.back()
  }

  onMounted(() => {
    fetchData()
  })

  onBeforeUnmount(() => {
    infoDataEntityStore.clearEntityData()
  })
</script>

<style scoped>
  .entity-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>
