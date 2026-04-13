<template>
  <div class="entity-wrapper">
    <CustomDataEntity
      :blocks="apiResult.blocks"
      :block-details="apiResult.blockDetails"
      :data="apiResult.data"
      :actions="actions"
      @click:action="(...args: any[]) => emit('click:action', ...args)"
      :loading="loading"
    >
      <template #field="{ field, value }">
        <!-- TODO: Для апи ключа в boolean показывается "всё" -->
        <InfoEditableField
          :field="field"
          :editable="field.editable"
          :value="value"
          @update="handleFieldUpdate"
        />
      </template>
    </CustomDataEntity>

    <SaveAffix v-show="isDataChanged" v-model:saving="saving" @save="saveAll" @cancel="cancelAll" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, type PropType } from 'vue'
  import CustomDataEntity from '../CustomDataEntity/CustomDataEntity.vue'
  import type {
    Action,
    IEntity,
  } from '@/src/components/layout/CustomDataEntity/CustomDataEntity.type'
  import SaveAffix from '@/src/components/common/affix/SaveAffix.vue'
  import InfoEditableField from '@/src/components/common/infodata/InfoEditableField/InfoEditableField.vue'

  const saving = ref(false)
  const isDataChanged = ref<boolean>(true)
  const apiResult = ref<IEntity>({
    blocks: [],
    blockDetails: [],
    data: {},
  })
  const loading = ref<boolean>(true)

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
    loading.value = false
  }

  const handleFieldUpdate = () => {}

  const saveAll = () => {
    console.log(childrenActions.value)
  }

  const cancelAll = () => {}

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
