<template>
  <div class="entity-wrapper">
    <!-- TODO: add loader and sort filters -->
    <CustomDataEntity
      :blocks="apiResult.blocks"
      :block-details="apiResult.blockDetails"
      :data="apiResult.data"
      :actions="actions"
      @click:action="(...args: any[]) => emit('click:action', ...args)"
    >
      <template #field="{ field, value }">
        <!-- TODO: Для апи ключа в boolean показывается "всё" -->
        <FieldEditable
          :field="field"
          :editable="field.editable"
          :value="value"
          @update="handleFieldUpdate"
        />
      </template>
    </CustomDataEntity>

    <SaveAffix
      v-show="changedData"
      v-model:saving="saving"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import type {
    Action,
    IEntity,
  } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import SaveAffix from './SaveAffix.vue'
  import FieldEditable from './FieldEditable.vue'

  const saving = ref(false)
  const changedData = ref<boolean>(false)
  const apiResult = ref<IEntity>({
    blocks: [],
    blockDetails: [],
    data: {},
  })

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
    apiResult.value = await props.fetchDataReq()
  }

  const handleSave = async () => {}

  const handleCancel = async () => {}

  const handleFieldUpdate = () => {}

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
