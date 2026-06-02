<template>
  <InfoInput v-if="field.type === 'string'" v-model:value="localValue" />

  <InfoInputNumber v-else-if="field.type === 'number'" v-model:value="localValue" />

  <InfoBooleanSelect
    v-else-if="field.type === 'boolean' && (localValue === 1 || localValue === 0)"
    v-model:value="localValue"
  />

  <InfoSelect
    v-else-if="field.type === 'select'"
    v-model:value="localValue"
    :select-url="field.selectUrl || ''"
  />

  <InfoDatePicker
    v-else-if="field.type === 'datetime'"
    v-model:value="localValue"
    value-format="yyyy-MM-dd HH:mm:ss"
  />

  <div class="actions">
    <n-button type="info" color="#2f9acc" @click="onSave" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="acceptIcon" alt="accept" />
        </n-icon>
      </template>
    </n-button>
    <n-button type="info" color="#7c7c7cc0" @click="onCancel" size="tiny">
      <template #icon>
        <n-icon>
          <img class="action-sprite" :src="cancelIcon" alt="cancel" />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
  import acceptIcon from '/icons/accept.svg'
  import cancelIcon from '/icons/cancel.svg'
  import { ref } from 'vue'
  import InfoInput from './components/InfoInput.vue'
  import InfoInputNumber from './components/InfoInputNumber.vue'
  import InfoBooleanSelect from './components/InfoBooleanSelect.vue'
  import InfoSelect from './components/InfoSelect.vue'
  import InfoDatePicker from './components/InfoDatePicker.vue'
  import { useInfoDataEntityStore } from '@/src/store/infoDataEntity'
  import { watch } from 'vue'
  import type { IField } from '@/src/utils/api/models/infoEntiyt.base'

  const props = withDefaults(defineProps<{ field: IField }>(), {})

  const infoDataEntityStore = useInfoDataEntityStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localValue = ref<any>(infoDataEntityStore.getValueOfField(props.field))

  const emits = defineEmits(['exist-editing'])

  const onSave = () => {
    infoDataEntityStore.updateFieldValue(props.field.editPath || props.field.path, localValue.value)
    emits('exist-editing')
  }

  const onCancel = () => {
    infoDataEntityStore.resetFieldValue(props.field)
    emits('exist-editing')
  }

  watch(
    () => infoDataEntityStore.getCancelationToken(),
    () => {
      onCancel()
    }
  )
</script>

<style>
  .actions {
    display: flex;
    gap: 6px;
  }

  .action-sprite {
    height: 15px;
    width: 15px;
  }
</style>
