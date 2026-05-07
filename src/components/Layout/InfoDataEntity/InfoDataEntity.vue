<template>
  <div class="entity-wrapper">
    <CustomDataEntity
      :actions="actions"
      @click:action="(...args: any[]) => emit('click:action', ...args)"
      :loading="loading"
    >
      <template #field="{ field }">
        <InfoEditableField
          :field="field"
          :editable="field.editable"
          :value="infoDataEntityStore.getValueOfField(field)"
        />
      </template>
      <template #tree="{ block }">
        <InfoEditableTree
          :block="block"
          :blockDetails="infoDataEntityStore.getBlockDetails<IBlockTreeDetail>(block.code)"
        />
      </template>
    </CustomDataEntity>

    <SaveAffix v-show="infoDataEntityStore.hasChanges" @save="saveAll" @cancel="cancelAll" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import type {
    Action,
    IBlockTreeDetail,
    IEntity,
  } from '@/src/components/Layout/CustomDataEntity/CustomDataEntity.type'
  import SaveAffix from '@/src/components/common/Affix/SaveAffix.vue'
  import InfoEditableField from '@/src/components/common/InfoDataEntity/InfoEditableField/InfoEditableField.vue'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import InfoEditableTree from '@/src/components/common/InfoDataEntity/InfoEditableTree/InfoEditableTree.vue'

  const loading = ref<boolean>(true)
  const infoDataEntityStore = useInfoDataEntityStore()

  const props = defineProps({
    fetchDataReq: {
      required: true,
      type: Function as PropType<() => Promise<IEntity>>,
    },
    actions: {
      required: false,
      type: Array as PropType<Action[]>,
    },
  })
  const emit = defineEmits(['click:action'])

  const fetchData = async () => {
    loading.value = true
    const result = await props.fetchDataReq()
    infoDataEntityStore.setData(result.data)
    infoDataEntityStore.setBlocks(result.blocks)
    infoDataEntityStore.setBlockDetails(result.blockDetails)
    loading.value = false
  }

  const saveAll = () => {
    fetchData()
  }

  const cancelAll = () => {
    infoDataEntityStore.resetData()
  }

  onMounted(() => {
    fetchData()
  })

  // #region tiregger update

  const triggerTableUpdate = defineModel<boolean>({ required: false, default: false })
  watch(triggerTableUpdate, (value: boolean) => {
    if (!value) return
    fetchData()
    triggerTableUpdate.value = false
  })

  // #endregion
</script>

<style>
  .entity-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>
