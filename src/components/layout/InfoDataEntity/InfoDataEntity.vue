<template>
  <div class="entity-wrapper">
    <CustomDataEntity
      :blocks="apiResult.blocks"
      :block-details="apiResult.blockDetails"
      :data="infoDataEntityStore.currentData"
      :actions="actions"
      @click:action="(...args: any[]) => emit('click:action', ...args)"
      :loading="loading"
    >
      <template #field="{ field, value }">
        <InfoEditableField
          :field="field"
          :editable="field.editable"
          :value="value"
          @update="handleFieldUpdate"
        />
      </template>
    </CustomDataEntity>

    <SaveAffix
      v-show="infoDataEntityStore.hasChanges"
      v-model:saving="saving"
      @save="saveAll"
      @cancel="cancelAll"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import type {
    Action,
    Data,
    IEntity,
    IField,
  } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import SaveAffix from '@/src/components/common/affix/SaveAffix.vue'
  import InfoEditableField from '@/src/components/common/infodata/InfoEditableField/InfoEditableField.vue'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'

  const saving = ref(false)
  const apiResult = ref<IEntity>({
    blocks: [],
    blockDetails: [],
    data: {},
  })
  const loading = ref<boolean>(true)
  const infoDataEntityStore = useInfoDataEntityStore()

  const childrenActions = ref()

  const triggerTableUpdate = defineModel<boolean>({ required: false, default: false })
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
    apiResult.value = await props.fetchDataReq()
    infoDataEntityStore.setData(apiResult.value.data)
    loading.value = false
  }

  const handleFieldUpdate = ({ field, value }: { field: IField; value: Data[string] }) => {
    infoDataEntityStore.updateFieldValue(field.path, value)
  }

  const saveAll = () => {
    console.log(childrenActions.value)
  }

  const cancelAll = () => {
    infoDataEntityStore.resetDataToDefault()
  }

  onMounted(() => {
    fetchData()
  })

  watch(triggerTableUpdate, (value: boolean) => {
    if (!value) return
    fetchData()
    triggerTableUpdate.value = false
  })
</script>

<style>
  .entity-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>
